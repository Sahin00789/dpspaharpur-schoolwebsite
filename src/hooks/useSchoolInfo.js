/**
 * Hook to provide school information
 * This can be extended to fetch data from an API in the future
 */

const useSchoolInfo = () => ({
  // School Basic Information
  name: "Dina Public School",
  shortName: "DPS",
  established: 2005,
  affiliation: "CBSE",
  schoolCode: "1234567",
  udiseCode: "WB12345678",
  
  // Complete Address Information
  address: {
    
    village: "Paharpur",
    postOffice: "Singadaha",
    block: "Banshihari",
    district: "Dakshin Dinajpur",
    state: "West Bengal",
    pincode: "733125",
    country: "India",
    formatted: "Paharpur, Banshihari, Dakshin Dinajpur, West Bengal - 733125, India",
    googleMapsLink: "https://maps.google.com/?q=Dina+Public+School+Paharpur"
  },
  
  // Contact Information
  contact: {
    primaryPhone: "+91 8116392244",
    whatsapp: "+91 6295884463",
    primaryEmail: "dinapublicschool@gmail.com",
    secondaryEmail: "contact@dpspaharpur.com",
    email: ["dinapublicschool.paharpur@gmail.com", "contact@dpspaharpur.com"],
    website: "https://dpspaharpur.com",
    
    // Key Personnel
    principal: {
      name: "Akib Sarkar",
      phone: "+91 8116392244",
      email: "principal@dpspaharpur.com",
      designation: "Principal"
    },
    
    // Department Contacts
    admissions: {
      phone: ["+91 9876543210"],
      email: ["admission@dpspaharpur.com"]
    },
    accounts: {
      phone: ["+91 9876543211"],
      email: ["accounts@dpspaharpur.com"]
    },
    
    // Emergency Contacts
    emergency: [
      { name: "School Office", phone: "+91 8116392244" },
      { name: "Security", phone: "+91 9876543212" }
    ]
  },
  
  // School Timings
  timings: {
    office: "8:00 AM - 3:00 PM",
    reception: "9:00 AM - 5:00 PM",
    school: "10:00 AM - 4:30 PM",
    workingDays: "Monday to Saturday",
    holidays: "Sunday and Public Holidays"
  },
  
  // Social Media Links
  social: {
    facebook: "https://facebook.com/dpspaharpur",
    twitter: "https://twitter.com/dpspaharpur",
    instagram: "https://instagram.com/dpspaharpur",
    youtube: "https://youtube.com/dpspaharpur",
    linkedin: "https://linkedin.com/company/dpspaharpur"
  },
  
  // School Features
  features: [
    "Bengali Medium School",
    "Smart Classrooms",
    "Science & Computer Labs",
    "Library",
    "Sports Facilities",
    "Transportation",
    "CCTV Surveillance"
  ],
  
  // Utility Methods
  getFormattedAddress: function() {
    return this.address.formatted;
  },
  
  getPrimaryContact: function() {
    return {
      phone: this.contact.primaryPhone,
      email: this.contact.primaryEmail,
      address: this.getFormattedAddress()
    };
  },
  
  getWorkingHours: function() {
    return `${this.timings.workingDays}: ${this.timings.school}`;
  }
});

export default useSchoolInfo;
