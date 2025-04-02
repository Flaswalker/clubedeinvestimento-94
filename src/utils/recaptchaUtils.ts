
// ReCAPTCHA site key (publicly visible)
export const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

// Validate reCAPTCHA token
export const validateRecaptchaToken = async (token: string): Promise<boolean> => {
  try {
    // In a real application, this would call a backend API to verify the token
    // For this demo, we'll simulate a successful verification
    console.log("Validating reCAPTCHA token:", token);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Always return true for this demo
    return true;
  } catch (error) {
    console.error("Error validating reCAPTCHA token:", error);
    return false;
  }
};
