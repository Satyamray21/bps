import Booking from "../model/booking.model.js";
import Quotation from "../model/customerQuotation.model.js";
import CustomerLedgerHistory from "../model/customerLedgerHistory.model.js";
import {Customer} from "../model/customer.model.js"

export const getInvoices = async (req, res) => {
  try {
    const { emailId, contactNumber, orderType, fromDate, endDate } = req.body;

    // Find the customer
    const customerQuery = emailId ? { emailId: emailId } : { mobile: contactNumber };
    console.log("Looking for customer with:", customerQuery);

    const customer = await Customer.findOne(customerQuery);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Parse date range
    const startDate = new Date(fromDate);
    const finalEndDate = new Date(endDate); // use a new variable

    // Fetch orders based on orderType and date range
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

    // Create the invoice preview response
    const invoicePreview = orders.map((order, index) => ({
      sno: index + 1,
      bookingId: order.bookingId,
      date: order.bookingDate || order.quotationDate,
      pickupLocation: order.startStation?.stationName || "",
      dropLocation: order.endStation,
      amount: order.amount,
    }));

    return res.status(200).json(invoicePreview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching invoices" });
  }
};

// Generate and submit invoice
export const submitInvoice = async (req, res) => {
  try {
    const { emailId, contactNumber, orderType, fromDate, toDate } = req.body;

    // Find the customer
    const customerQuery = emailId ? { email: emailId } : { mobile: contactNumber };
    const customer = await Customer.findOne(customerQuery);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Parse date range
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Fetch orders based on orderType and date range
    let orders;
    if (orderType === "Booking") {
      orders = await Booking.find({
        customerId: customer._id,
        bookingDate: { $gte: startDate, $lte: endDate },
      }).select("bookingId bookingDate startStation endStation amount remainingAmount");
    } else if (orderType === "Quotation") {
      orders = await Quotation.find({
        customerId: customer._id,
        quotationDate: { $gte: startDate, $lte: endDate },
      }).select("bookingId quotationDate startStation endStation amount remainingAmount");
    } else {
      return res.status(400).json({ message: "Invalid order type" });
    }

    // Generate invoiceId
    const invoiceId = `BHPAR${Math.floor(Math.random() * 1000)}INVO`;

    // Create the invoice record in the ledger history
    const invoiceHistory = await CustomerLedgerHistory.create({
      customerId: customer._id,
      orderType: orderType,
      orderRef: orders[0]._id,
      orderTypeRef: orderType,
      amount: orders.reduce((acc, order) => acc + order.amount, 0),
      remainingAmount: orders.reduce((acc, order) => acc + order.remainingAmount, 0),
      additionalComments: "Invoice generated",
    });

    const finalInvoice = {
      sno: 1, 
      invoiceId: invoiceId,
      bookingId: orders[0].bookingId,
      date: orders[0].bookingDate || orders[0].quotationDate,
      name: customer.firstName + " " + customer.lastName,
      order: orderType,
      amount: orders.reduce((acc, order) => acc + order.amount, 0),
      paidAmount: orders.reduce((acc, order) => acc + (order.amount - order.remainingAmount), 0),
      remainingAmount: orders.reduce((acc, order) => acc + order.remainingAmount, 0),
      invoiceLink: `http://localhost:5000/invoices/${invoiceId}`,
    };

    return res.status(200).json(finalInvoice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error generating invoice" });
  }
};
