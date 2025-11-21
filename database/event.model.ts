import mongoose, { Document, Model, Schema } from 'mongoose';

// Strongly typed Event document shape (including timestamps managed by Mongoose).
export interface EventDocument extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // Normalized ISO date string (YYYY-MM-DD)
  time: string; // Normalized time string (HH:MM, 24-hour)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<EventDocument>;

// Basic, dependency-free slug generator for URL-friendly identifiers.
const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes

// Normalize date to `YYYY-MM-DD` (ISO calendar date).
const normalizeDate = (value: string): string => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date format for Event.date');
  }

  return parsed.toISOString().slice(0, 10);
};

// Normalize time to `HH:MM` 24-hour format.
const normalizeTime = (value: string): string => {
  const trimmed = value.trim();

  // Accept `HH:MM` or `H:MM` optionally with AM/PM (e.g. "9:30 pm").
  const match = trimmed.match(/^([0-1]?\d|2[0-3]):([0-5]\d)(?:\s*([APap][Mm]))?$/);

  if (!match) {
    throw new Error('Invalid time format for Event.time');
  }

  let hours = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3]?.toLowerCase();

  if (meridiem) {
    if (hours === 12) {
      hours = meridiem === 'am' ? 0 : 12;
    } else if (meridiem === 'pm') {
      hours += 12;
    }
  }

  const hh = hours.toString().padStart(2, '0');

  return `${hh}:${minutes}`;
};

// Reusable non-empty string validator for required string fields.
const requiredString = (fieldName: string) => ({
  type: String,
  required: [true, `${fieldName} is required`],
  trim: true,
  validate: {
    validator: (value: string): boolean => value.trim().length > 0,
    message: `${fieldName} cannot be empty`,
  },
});

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: requiredString('Title'),
    slug: {
      type: String,
      unique: true,
      index: true, // unique index for fast lookups by slug
    },
    description: requiredString('Description'),
    overview: requiredString('Overview'),
    image: requiredString('Image'),
    venue: requiredString('Venue'),
    location: requiredString('Location'),
    date: {
      type: String,
      required: [true, 'Date is required'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
    },
    mode: requiredString('Mode'),
    audience: requiredString('Audience'),
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: 'Agenda must contain at least one non-empty item',
      },
    },
    organizer: requiredString('Organizer'),
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (value: string[]): boolean =>
          Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0),
        message: 'Tags must contain at least one non-empty item',
      },
    },
  },
  {
    timestamps: true, // automatically manage createdAt and updatedAt
  }
);

// Explicit unique index on slug for safety at the database level.
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-save hook to:
// - Generate / update slug when title changes.
// - Normalize date to ISO `YYYY-MM-DD`.
// - Normalize time to `HH:MM` 24-hour format.
eventSchema.pre('save', function (next) {
  try {
    // Only regenerate slug when title has changed.
    if (this.isModified('title')) {
      this.slug = slugify(this.title);
    }

    if (this.isModified('date')) {
      this.date = normalizeDate(this.date);
    }

    if (this.isModified('time')) {
      this.time = normalizeTime(this.time);
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Reuse existing model in development to prevent model overwrite errors.
export const Event: EventModel =
  (mongoose.models.Event as EventModel) || mongoose.model<EventDocument, EventModel>('Event', eventSchema);
