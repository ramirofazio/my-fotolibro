export const storage = {
  set: ({ name, object, deleted = false }) => {
    if (deleted) {
      localStorage.setItem(name, "");
    } else {
      localStorage.setItem(name, JSON.stringify(object));
    }
  },
  get: ({ name }) => {
    if (name?.length) {
      let object = localStorage.getItem(name);
      return object ? JSON.parse(object) : "null";
    }
    return null;
  },
};