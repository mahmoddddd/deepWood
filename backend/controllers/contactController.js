const Contact = require('../models/Contact');
const Settings = require('../models/Settings');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all contact requests
// @route   GET /api/contacts
exports.getContactRequests = asyncHandler(async (req, res, next) => {
  const contacts = await Contact.find().sort('-createdAt');
  res.status(200).json({ success: true, count: contacts.length, data: contacts });
});

// @desc    Get single contact request
// @route   GET /api/contacts/:id
exports.getContactRequest = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return next(new AppError('Contact request not found', 404));
  res.status(200).json({ success: true, data: contact });
});

// @desc    Create new contact request
// @route   POST /api/contacts
exports.createContactRequest = asyncHandler(async (req, res, next) => {
  const contact = await Contact.create(req.body);

  // Send Email Notification
  try {
    const settings = await Settings.findOne();
    const adminEmail = settings?.contactEmail || process.env.CONTACT_EMAIL;

    if (adminEmail) {
        const message = `
            <h3>New Contact Message</h3>
            <p><strong>Name:</strong> ${req.body.name}</p>
            <p><strong>Email:</strong> ${req.body.email}</p>
            <p><strong>Subject:</strong> ${req.body.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${req.body.message}</p>
        `;

        await sendEmail({
            email: adminEmail,
            subject: `New Contact: ${req.body.subject}`,
            message,
        });
    }
  } catch (err) {
    console.error('Email send failed:', err);
    // Continue success response even if email fails
  }

  res.status(201).json({ success: true, data: contact });
});

// @desc    Update contact request
// @route   PUT /api/contacts/:id
exports.updateContactRequest = asyncHandler(async (req, res, next) => {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return next(new AppError('Contact not found', 404));

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: contact });
});

// @desc    Delete contact request
// @route   DELETE /api/contacts/:id
exports.deleteContactRequest = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return next(new AppError('Contact request not found', 404));
  await contact.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get stats
// @route   GET /api/contacts/stats
exports.getContactStats = asyncHandler(async (req, res, next) => {
    const stats = await Contact.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data: stats });
});

// @desc    Respond to request
// @route   POST /api/contacts/:id/respond
exports.respondToRequest = asyncHandler(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return next(new AppError('Contact not found', 404));

    // Send email to the person who contacted
    const { message, subject } = req.body;
    try {
        await sendEmail({
            email: contact.email,
            subject: subject || `Re: ${contact.subject}`,
            message: message // Or wrap in HTML template
        });

        contact.status = 'replied';
        await contact.save();

        res.status(200).json({ success: true, message: 'Response sent successfully' });
    } catch (error) {
        return next(new AppError('Email sending failed', 500));
    }
});
