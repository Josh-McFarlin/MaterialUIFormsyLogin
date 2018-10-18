export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function simulateRegister(credentials, model) {
  return await new Promise((resolve, reject) => {
    for (let user of credentials) {
      if (user.email === model.email) {
        return reject("The email is already registered!");
      }
    }

    return resolve("Registration was successful!");
  });
}

export async function simulateLogin(credentials, model) {
  return await new Promise((resolve, reject) => {
    for (let user of credentials) {
      if (user.email === model.email) {
        if (user.password === model.password) {
          return resolve(user);
        } else {
          return reject("Incorrect password!");
        }
      }
    }

    return reject("Email not found!");
  });
}
