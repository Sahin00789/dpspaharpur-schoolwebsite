// School information object
const schoolInfo = {
  // Basic Information
  name: 'Dina Public School',
  branch: 'Paharpur',
  fullName: 'Dina Public School, Paharpur',
  shortName: 'DPS',
  
  // Contact Information
  address: {
    line1: 'Paharpur',
    line2: 'Banshihari',
    district: 'Dakshin Dinajpur',
    state: 'West Bengal',
    pincode: '733125',
    fullAddress: 'Paharpur, Banshihari, Dakshin Dinajpur, West Bengal - 733125'
  },
  
  // Official Details
  registration: {
    number: 'IV006608/IV',
    authority: 'West Bengal Board of Secondary Education',
    udise: null
  },
  
  // Administration
  runBy: 'M.M.D.C.T.',
  established: '2022',
  
  // Contact Details
  contact: {
    phone: [],
    email: ['dinapublicschool.paharpur@gmail.com'],
    website: 'https://www.dpspaharpur.web.app',
    principal: 'Akib Sarkar'
  },
  
  // Academic Information
  board: 'WBBSE & WBCHSE',
  classes: ['LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
  
  // Social Media
  socialMedia: {
    facebook: 'https://facebook.com/dpspaharpur',
    instagram: 'https://instagram.com/dpspaharpur',
    whatsapp: 'https://wa.me/919123456789',
    youtube: 'https://youtube.com/dpspaharpur',
    twitter: 'https://twitter.com/dpspaharpur'
  },
  
  // Timings
  timings: '7:30 AM - 1:30 PM (Mon-Sat)',

  // Helper methods
  getFormattedAddress(format = 'full') {
    const address = this.address || {};
    
    switch (format) {
      case 'singleLine':
        return address.fullAddress || `${address.line1 || ''}, ${address.district || ''}`.trim();
      case 'multiLine':
        return `${address.line1 || ''}, ${address.line2 || ''}\n${address.district || ''}, ${address.state || ''} - ${address.pincode || ''}`.trim();
      case 'short':
        return `${address.line1 || ''}, ${address.district || ''}`.trim();
      default:
        return address.fullAddress || `${address.line1 || ''}, ${address.line2 || ''}, ${address.district || ''}, ${address.state || ''} - ${address.pincode || ''}`.trim();
    }
  },

  getSchoolName(withBranch = true) {
    return withBranch && this.branch 
      ? `${this.name}, ${this.branch}`
      : this.name;
  }
};

// Export the school info object as default
export default schoolInfo;

// Export default school info for backward compatibility
export const defaultSchoolInfo = schoolInfo;