const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (replace with your configuration)
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();

async function findAndMatchUsers() {
  try {
    // Step 1: Retrieve users with status 2
    const usersSnapshot = await db
      .collection('users')
      .where('status', '==', 2)
      .get();

    if (usersSnapshot.empty) {
      console.log('No users with status 2 found.');
      return;
    }

    // Build an array of users with their interests
    const usersArray = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      usersArray.push({
        id: doc.id,
        name: userData.name,
        email: userData.email,
        interests: userData.interests || [], // Default to empty array if no interests
      });
    });

    console.log('Users with status 2:', usersArray);

    // Step 2: Match users based on common interests
    const matchedPairs = [];
    for (let i = 0; i < usersArray.length; i++) {
      for (let j = i + 1; j < usersArray.length; j++) {
        const commonInterests = usersArray[i].interests.filter((interest) =>
          usersArray[j].interests.includes(interest)
        );

        // Only add pairs with at least one common interest
        if (commonInterests.length > 0) {
          matchedPairs.push({
            user1: usersArray[i],
            user2: usersArray[j],
            commonInterests,
            commonCount: commonInterests.length,
          });
        }
      }
    }

    // Sort pairs by the number of common interests (descending)
    matchedPairs.sort((a, b) => b.commonCount - a.commonCount);

    console.log('Matched Users:', matchedPairs);

    return matchedPairs; // Return the result if needed
  } catch (error) {
    console.error('Error fetching or processing users:', error);
    throw error;
  }
}

// Call the function
findAndMatchUsers()
  .then((result) => {
    console.log('Matching complete:', result);
  })
  .catch((error) => {
    console.error('Error:', error);
  })