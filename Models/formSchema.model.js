const mongoose = require("mongoose");
const formSchema = new mongoose.Schema(
  {
    /* ===============================
       BASIC FORM INFORMATION
    =============================== */
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: true
    },
   /* ===============================
       CATEGORY
    =============================== */
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    // ✅ OPTIONAL
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
      
    },

 // },
    examAuthority: {
      type: String,
      // Example: UPSC, NTA, SSC Board
    },
    officialWebsite: {
      type: String
    },
    /* ===============================
       IMPORTANT DATES
    =============================== */
    applicationStartDate: {
      type: Date,
      required: true
    },
    applicationEndDate: {
      type: Date,
      required: true
    },
    examDate: {
      type: Date
    },
    resultDate: {
      type: Date
    },
    /* ===============================
       FEES STRUCTURE
    =============================== */
    formFees: {
      type: Number,
      required: true,
      min: 0
    },
    platformCharge: {
      type: Number,
      required: true,
      min: 0
    },
    totalPayable: {
      type: Number,
      min: 0
      // formFees + platformCharge (can be calculated)
    },
    paymentRequired: {
      type: Boolean,
      default: true
    },
    /* ===============================
       VACANCY & ELIGIBILITY
    =============================== */
    numberOfVacancies: {
      type: Number,
      default: 0
    },
    eligibilityCriteria: {
      type: String
      // Age limit, qualification etc.
    },
    /* ===============================
       REQUIRED DOCUMENTS
    =============================== */
    requiredDocuments: [
      {
        name: {
          type: String,
          required: true
        },
        isMandatory: {
          type: Boolean,
          default: true
        },
       
        allowedFormats: {
          type: [String],
          default: ["pdf", "jpg", "png"]
        },
        maxSizeMB: {
          type: Number,
          default: 2
        },
        source: {
          type: String,
          enum: ["DigiLocker", "Upload"],
          default: "Upload"
        }
      }
    ],
    /* ===============================
       EXTRA DETAILS / INSTRUCTIONS
    =============================== */
    extraDetails: {
      type: String
      // Any extra information from authority
    },
    instructions: {
      type: String
    },
    termsAndConditions: {
      type: String,
      required: true
    },
    /* ===============================
       SLOT BOOKING CONFIGURATION
    =============================== */
    slotBookingEnabled: {
      type: Boolean,
      default: true
    },
    slotTypes: [
      {
        label: {
          type: String
          // Before start, During application, Last date
        },
        startTime: Date,
        endTime: Date,
        maxBookings: Number
      }
    ],
    /* ===============================
       STATUS & VISIBILITY
    =============================== */
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    /* ===============================
       ANALYTICS & TRACKING
    =============================== */
    numberOfViews: {
      type: Number,
      default: 0
    },
    numberOfRequests: {
      type: Number,
      default: 0
    },
    completedRequests: {
      type: Number,
      default: 0
    },
    revenueGenerated: {
      type: Number,
      default: 0
    },
    /* ===============================
       WORKFLOW CONFIGURATION
    =============================== */
    requiresManualReview: {
      type: Boolean,
      default: true
    },
    autoAssignSubAdmin: {
      type: Boolean,
      default: false
    },
    /* ===============================
       AUDIT & OWNERSHIP
    =============================== */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  {
    timestamps: true // creates createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Form", formSchema);










