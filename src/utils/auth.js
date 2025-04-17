const AuthStorageKey = 'splitappuser'



const users = [
    {
      id: 1,
      name: "Leanne Graham",
      password: "12345",
    },
    {
      id: 2,
      name: "Martin Lucas",
      password: "12345",
    },
    {
      id: 3,
      name: "Jason Bright",
      password: "12345",
    },
    {
      id: 4,
      name: "Sam Wills",
      password: "12345",
    },
    {
      id: 5,
      name: "John Lucas",
      password: "12345",
    },
  ];
  



  export function authenticateUser(username, password) {
    const user = users.find(
      (userItem) => userItem.name.toLowerCase() === username.toLowerCase() && userItem.password === password
    );
    console.log("Auth",user)

    return user ? { ...user } : null;
  }
  
  export function getUsers() {
    return [...users];
  }

  export function registerAuthenticatedUsertoLocalStorage(user){
    const authObj = {
        user,
    }
    localStorage.setItem(AuthStorageKey, JSON.stringify(authObj))
  }

  export function isAuthenticatedUser(){
    const auth = localStorage.getItem(AuthStorageKey)
    const authObj =  JSON.parse(auth)
    const findUser = users?.find((userItem) => userItem.name === authObj?.user)
    return findUser
  }

  export function deleteAuthUseronLogout(){
    localStorage.removeItem(AuthStorageKey)
  } 