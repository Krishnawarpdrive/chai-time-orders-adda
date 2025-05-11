
/*
This is a utility script to add staff users. Run it in the browser console while logged in as an admin.
You should first create a normal user account, then run this script to promote that user to staff.

Usage:
1. Create a new user account through the signup page
2. Login as an admin
3. Open browser console and paste this script
4. Run the function with the user's ID: promoteToStaff('user-id-here', 'staff')
*/

async function promoteToStaff(userId, role = 'staff') {
  if (!userId) {
    console.error('User ID is required');
    return;
  }
  
  // Get supabase from window
  const { supabase } = window;
  
  if (!supabase) {
    console.error('Supabase client not found in window object');
    return;
  }
  
  try {
    // Insert a new role for the user
    const { data, error } = await supabase
      .from('user_roles')
      .upsert([
        {
          user_id: userId,
          role: role // 'staff' or 'admin'
        }
      ]);
      
    if (error) {
      console.error('Error promoting user:', error);
      return;
    }
    
    console.log('User promoted successfully:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Example usage:
// promoteToStaff('user-id-here', 'staff');
