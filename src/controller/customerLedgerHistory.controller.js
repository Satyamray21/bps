import Booking from "../model/booking.model.js";
import Quotation from "../model/customerQuotation.model.js";
import CustomerLedgerHistory from "../model/customerLedgerHistory.model.js";
import {Customer} from "../model/customer.model.js"

export const getInvoices = async (req, res) => {
  try {
    const { emailId, contactNumber, orderType, fromDate, endDate } = req.body;

    const customerQuery = emailId ? { emailId: emailId } : { mobile: contactNumber };

    const customer = await Customer.findOne(customerQuery);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const startDate = new Date(fromDate);
    const finalEndDate = new Date(endDate); 
    let orders;
    if (orderType === "Booking") {
      orders = await Booking.find({
        customerId: customer._id,
        bookingDate: { $gte: startDate, $lte: finalEndDate },
      })
      .populate("startStation", "stationName")
      .populate("endStation", "stationName")
      .select("bookingId bookingDate startStation endStation amount ")
    } else if (orderType === "Quotation") {
      orders = await Quotation.find({
        customerId: customer._id,
        quotationDate: { $gte: startDate, $lte: finalEndDate },
      })
      .populate("startStation", "stationName")
      .populate("endStation", "stationName")
      .select("bookingId quotationDate startStation endStation amount ")
    } else {
      return res.status(400).json({ message: "Invalid order type" });
    }

    const invoicePreview = orders.map((order, index) => ({
      sno: index + 1,
      bookingId: order.bookingId,
      date: order.bookingDate || order.quotationDate,
      pickupLocation: order.startStation?.stationName || "",
      dropLocation: order.endStation,
      amount: order.amount,
    }));

await Promise.all(
  orders.map(order => order.updateOne({ invoiceGenerated: true }))
);


    return res.status(200).json(invoicePreview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching invoices" });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const bookings = await Booking.find({ invoiceGenerated: true })
      .populate("customerId", "firstName lastName");

    const quotations = await Quotation.find({ invoiceGenerated: true })
      .populate("customerId", "firstName lastName");

    const allInvoices = [...bookings, ...quotations];

    const invoiceList = allInvoices.map((invoice, index) => {
      const randomFourDigits = Math.floor(1000 + Math.random() * 9000); 
      const invoiceId = `BHPAR${randomFourDigits}INVO`;

      const totalAmount = invoice.amount;
      const paidAmount = invoice.amount - (invoice.remainingAmount || 0);
      const remainingAmount = invoice.remainingAmount || 0;

      const customerName = invoice.customerId
        ? `${invoice.customerId.firstName} ${invoice.customerId.lastName}`
        : "Unknown Customer";

      return {
        sno: index + 1,
        invoiceId: invoiceId,
        bookingId: invoice.bookingId,
        date: invoice.bookingDate || invoice.quotationDate,
        name: customerName,
        order: invoice.bookingDate ? "Booking" : "Quotation",
        amount: totalAmount,
        paidAmount: paidAmount,
        remainingAmount: remainingAmount,
        invoiceLink: `http://localhost:8000/invoices/${invoiceId}`,
      };
    });

    return res.status(200).json(invoiceList);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ message: "Error fetching invoices" });
  }
};



