// Example user-service.js

// Mock user groups data
const groups= [
        { id: "bhincened", name: 'hello' },
        { id: "hellsnidjd", name: 'hi' }
      ]
 ;
  
  // Function to fetch user groups by email
  async function getUserGroups(email) {
    
    return groups;
  }
  
  module.exports = {
    getUserGroups,
  };
  