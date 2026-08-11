import { z } from 'zod';

// 1. Auth Sign In Schema
export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// 2. User / Model Registration Schema
export const registerUserSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['Model', 'Scout', 'Admin', 'Agency'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// 3. Password Reset Request Schema
export const passwordResetRequestSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address format')
});

// 4. Password Reset Form Schema
export const passwordResetConfirmSchema = z.object({
  token: z.string().trim().min(4, 'Reset token must be at least 4 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

// 5. Agency Registration Step 1 Schema
export const agencyStep1Schema = z.object({
  agencyName: z.string().trim().min(3, 'Agency name must be at least 3 characters'),
  ceoName: z.string().trim().min(2, 'CEO / Director name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address format'),
  phone: z.string().trim().min(8, 'Valid phone number is required (min 8 digits)'),
  province: z.string().min(1, 'Please select a province'),
  district: z.string().trim().min(2, 'District is required'),
  sector: z.string().trim().min(2, 'Sector is required'),
  licenseNumber: z.string().trim().min(4, 'License / RDB registration number is required')
});

// 6. Agency Registration Step 2 Schema
export const agencyStep2Schema = z.object({
  logo: z.string().trim().min(1, 'Logo URL or image path is required'),
  representedModelsCount: z.coerce.number().min(0, 'Roster count must be 0 or more'),
  categories: z.array(z.string()).min(1, 'Select at least one specialization category'),
  operatingYears: z.string().trim().min(1, 'Operating years description is required'),
  welfarePolicies: z.string().trim().min(10, 'Welfare policy description must be at least 10 characters')
});

// 7. Model Profile Update Schema (UserDashboard)
export const modelProfileDossierSchema = z.object({
  bio: z.string().trim().min(5, 'Bio must be at least 5 characters'),
  heightCm: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be under 250 cm'),
  bustCm: z.coerce.number().min(30, 'Bust measurement must be at least 30 cm').max(180, 'Bust measurement must be under 180 cm'),
  waistCm: z.coerce.number().min(30, 'Waist measurement must be at least 30 cm').max(180, 'Waist measurement must be under 180 cm'),
  hipsCm: z.coerce.number().min(30, 'Hips measurement must be at least 30 cm').max(180, 'Hips measurement must be under 180 cm')
});

export const modelProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  stageName: z.string().trim().min(2, 'Stage name must be at least 2 characters'),
  bio: z.string().trim().min(10, 'Bio must be at least 10 characters'),
  phone: z.string().trim().min(8, 'Phone number must be at least 8 digits'),
  province: z.string().min(1, 'Please select a province'),
  district: z.string().trim().min(2, 'District is required'),
  category: z.string().min(1, 'Category is required'),
  height: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be under 250 cm'),
  bust: z.coerce.number().min(30, 'Bust/Chest measurement must be at least 30 cm').max(180, 'Bust/Chest measurement must be under 180 cm'),
  waist: z.coerce.number().min(30, 'Waist measurement must be at least 30 cm').max(180, 'Waist measurement must be under 180 cm'),
  hips: z.coerce.number().min(30, 'Hips measurement must be at least 30 cm').max(180, 'Hips measurement must be under 180 cm'),
  eyeColor: z.string().trim().min(2, 'Eye color is required'),
  hairColor: z.string().trim().min(2, 'Hair color is required'),
  shoeSize: z.coerce.number().min(20, 'Shoe size EU must be at least 20').max(55, 'Shoe size EU must be under 55'),
  experienceLevel: z.string().min(1, 'Please select experience level'),
  instagram: z.string().trim().optional(),
  headshot: z.string().trim().min(1, 'Headshot URL is required')
});

// 8. Register New Model by Agency Schema
export const agencyRegisterModelSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  stageName: z.string().trim().min(2, 'Stage name must be at least 2 characters'),
  gender: z.enum(['Female', 'Male', 'Non-Binary']),
  height: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be under 250 cm'),
  province: z.string().min(1, 'Please select a province'),
  category: z.string().min(1, 'Please select a modeling category'),
  headshot: z.string().trim().min(1, 'Headshot URL is required'),
  bio: z.string().trim().optional()
});

// 9. Agency CEO Questions Schema
export const agencyCeoQuestionsSchema = z.object({
  operatingYears: z.string().trim().min(2, 'Years in operation is required'),
  welfarePolicies: z.string().trim().min(10, 'Welfare policy description must be at least 10 characters'),
  primaryFocus: z.string().trim().min(3, 'Primary market focus is required')
});

// 10. Casting Call Schema
export const castingCallSchema = z.object({
  title: z.string().trim().min(3, 'Casting title must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().trim().min(2, 'Location is required'),
  payRange: z.string().trim().min(2, 'Pay range or rate details are required'),
  requirements: z.string().trim().min(5, 'Requirements details are required'),
  deadline: z.string().min(1, 'Application deadline date is required')
});

// 11. Agency Invite Schema
export const agencyInviteSchema = z.object({
  input: z.string().trim().min(3, 'Model email or ARMA Member ID is required')
});

// 12. Admin Create Agency Schema
export const adminCreateAgencySchema = z.object({
  agencyName: z.string().trim().min(3, 'Agency name must be at least 3 characters'),
  ceoName: z.string().trim().min(2, 'CEO name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().trim().min(8, 'Phone number is required'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().trim().min(2, 'District is required'),
  licenseNumber: z.string().trim().min(4, 'License number is required'),
  representedModelsCount: z.coerce.number().min(0, 'Roster count must be 0 or positive')
});

// 13. Admin Create Model Schema
export const adminCreateModelSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  stageName: z.string().trim().min(2, 'Stage name is required'),
  gender: z.enum(['Female', 'Male', 'Non-Binary']),
  category: z.string().min(1, 'Category is required'),
  height: z.coerce.number().min(100, 'Height must be between 100 and 250 cm').max(250),
  province: z.string().min(1, 'Province is required'),
  district: z.string().trim().min(2, 'District is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  headshot: z.string().trim().min(1, 'Headshot URL is required')
});

// 14. Admin Add Super Admin Schema
export const adminAddSuperAdminSchema = z.object({
  name: z.string().trim().min(2, 'Admin full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  role: z.string().min(1, 'Role title is required'),
  accessLevel: z.string().min(1, 'Access level is required')
});

// 15. Admin Issue Certificate Schema
export const adminIssueCertSchema = z.object({
  recipientName: z.string().trim().min(2, 'Recipient name is required'),
  certificateType: z.string().min(1, 'Certificate type is required'),
  memberId: z.string().trim().min(3, 'Member / License ID is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required')
});

// 16. Admin Create News Schema
export const adminCreateNewsSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().trim().min(10, 'Summary must be at least 10 characters'),
  content: z.string().trim().min(20, 'Content must be at least 20 characters'),
  author: z.string().trim().min(2, 'Author name is required'),
  image: z.string().trim().min(1, 'Cover image URL is required')
});

// 17. Admin Create Event Schema
export const adminCreateEventSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters'),
  organizer: z.string().trim().min(2, 'Organizer name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  venue: z.string().trim().min(2, 'Venue location is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters')
});

// 18. Admin Create Document Schema
export const adminCreateDocumentSchema = z.object({
  title: z.string().trim().min(3, 'Document title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  fileFormat: z.string().min(1, 'Format is required'),
  fileSize: z.string().trim().min(1, 'File size is required'),
  downloadUrl: z.string().trim().min(1, 'Download URL is required')
});

// 19. Membership Application Schema
export const membershipApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().trim().min(8, 'Phone number is required (min 8 digits)'),
  membershipType: z.enum(['Model', 'Agency', 'Scout']),
  province: z.string().min(1, 'Please select a province'),
  district: z.string().trim().min(2, 'District is required'),
  experienceLevel: z.string().min(1, 'Select experience level'),
  portfolioUrl: z.string().trim().optional()
});

// 20. Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters')
});

// 21. Booking Inquiry Schema
export const bookingInquirySchema = z.object({
  clientName: z.string().trim().min(2, 'Client name must be at least 2 characters'),
  clientEmail: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  eventDate: z.string().optional(),
  campaignDetails: z.string().trim().min(5, 'Campaign details must be at least 5 characters')
});

export type ValidationResult<T> =
  | { success: true; data: T; errors: Record<string, string> }
  | { success: false; data: null; errors: Record<string, string> };

// Helper function to extract Zod error field messages as an object
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const pathKey = issue.path.join('.') || 'form';
    if (!errors[pathKey]) {
      errors[pathKey] = issue.message;
    }
  }

  return { success: false, data: null, errors };
}
