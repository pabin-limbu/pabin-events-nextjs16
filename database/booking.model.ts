import mongoose, { Document, Model, Schema, Types } from 'mongoose';

import { EventDocument } from './event.model';

// Strongly typed Booking document shape (including timestamps).
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingModel = Model<BookingDocument>;

// Simple email format check suitable for backend validation.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference (eventId) is required'],
      index: true, // index for efficient lookups by event
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailRegex.test(value),
        message: 'Email must be a valid email address',
      },
    },
  },
  {
    timestamps: true, // automatically manage createdAt and updatedAt
  }
);

// Pre-save hook to ensure the referenced Event exists and basic invariants hold.
bookingSchema.pre('save', async function (next) {
  try {
    // Double-check email validity in case it was modified bypassing validators.
    if (!emailRegex.test(this.email)) {
      return next(new Error('Email must be a valid email address'));
    }
         if (!this.isModified('eventId')) {
     return next();
   }

    // Verify that the referenced event exists before creating the booking.
    const EventModel = mongoose.models.Event as mongoose.Model<EventDocument> | undefined;

    if (!EventModel) {
      return next(new Error('Event model is not registered'));
    }

    const eventExists = await EventModel.exists({ _id: this.eventId });

    if (!eventExists) {
      return next(new Error('Referenced event does not exist'));
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Reuse existing model in development to prevent model overwrite errors.
export const Booking: BookingModel =
  (mongoose.models.Booking as BookingModel) ||
  mongoose.model<BookingDocument, BookingModel>('Booking', bookingSchema);
