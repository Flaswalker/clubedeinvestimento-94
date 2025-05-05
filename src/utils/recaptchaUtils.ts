
// ReCAPTCHA site key (publicly visible)
export const RECAPTCHA_SITE_KEY = "6LdAvi4rAAAAAEm_33qfoobxZMSgbEW5SquC5AwT";

// Initialize reCAPTCHA script
export const initRecaptchaScript = (): () => void => {
  const RECAPTCHA_URL = "https://www.google.com/recaptcha/api.js";
  
  // Check if the script is already loaded
  if (document.querySelector(`script[src="${RECAPTCHA_URL}"]`)) {
    return () => {}; // Script already exists, no cleanup needed
  }
  
  // Create and append the script
  const script = document.createElement("script");
  script.src = RECAPTCHA_URL;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  
  // Return cleanup function
  return () => {
    // Remove the script when component unmounts
    const recaptchaScript = document.querySelector(`script[src="${RECAPTCHA_URL}"]`);
    if (recaptchaScript) {
      document.head.removeChild(recaptchaScript);
    }
  };
};

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
