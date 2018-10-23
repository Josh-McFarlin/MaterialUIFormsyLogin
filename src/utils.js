export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function simulateRegister(credentials, model) {
  await sleep(1500);

  return await new Promise((resolve, reject) => {
    for (let user of credentials) {
      if (user.email === model.email) {
        return reject({email: "The email is already registered!"});
      }
    }

    return resolve("Registration was successful!");
  });
}

export async function simulateLogin(credentials, model) {
  await sleep(1500);
  
  return await new Promise((resolve, reject) => {
    for (let user of credentials) {
      if (user.email === model.email) {
        if (user.password === model.password) {
          return resolve(user);
        } else {
          return reject({password: "Incorrect password!"});
        }
      }
    }

    return reject({email: "Email not found!"});
  });
}
