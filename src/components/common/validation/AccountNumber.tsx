export const validateAccountNumber = (accountNumber: string) => {
    if (!/^\d{9,18}$/.test(accountNumber)) {
      return "Account number must be between 9 and 18 digits.";
    }
    return "";
  };


  export const validateIFSCCode = (ifscCode: string) => {
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      return "Invalid IFSC code format.";
    }
    return "";
  };

