const KEY = 'guest_wishlist';

export function getGuestWishlist() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

export function toggleGuestWishlistItem(item) {
  const list = getGuestWishlist();
  const id   = item._id || item.id;
  const idx  = list.findIndex(i => (i._id || i.id) === id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push({ _id: id, name: item.name, price: item.finalPrice ?? item.price, images: item.images });
  }
  localStorage.setItem(KEY, JSON.stringify(list));
  return idx < 0; // true = was added, false = was removed
}

export function isInGuestWishlist(itemId) {
  return getGuestWishlist().some(i => (i._id || i.id) === itemId);
}

export function clearGuestWishlist() {
  localStorage.removeItem(KEY);
}
