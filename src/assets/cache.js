
class Cache {
  constructor(type) {
    this.type = type;
    this.ctx = window; 
  }
  available() {
    let storage; 
    try {
      storage = window[this.type]; 
      let x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      this.open = true;
      return true;
    } catch (e) {
      this.open = false;
      return e instanceof DOMException && (
        e.code === 22 || // not firefox
        e.code === 1014 || // firefox
        // and also name fields to be safe
        e.name === 'QuotaExceededError' || // not firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' // firefox
      ) && (storage && storage.length !== 0);
    }
  }
  get storage() {
    if (this.open) {
      return window[this.type];
    }
  }
  lookup(key) {
    const storage = this.storage; 
    let item = storage.getItem(key); 
    return item ? JSON.parse(item) : false;
  }
  update(key, obj) {
    this.storage.setItem(key, JSON.stringify(obj));
  }
}

export default Cache; 