// Reference-counted body-scroll lock. Needed because more than one UI
// element can independently want scroll locked at once (the Navbar's
// mobile menu, this ConcertPromoModal, and potentially others later) —
// a naive "set on open, clear on close" in each one races: whichever
// closes last wins, so closing just one can incorrectly unlock scroll
// while another is still open (concretely: open the mobile menu on the
// homepage, let the concert promo appear over it, press Escape — only
// the promo's own effect would run, and a direct `overflow = ''` there
// would unlock scroll while the mobile menu is still open underneath).
let lockCount = 0

export function lockScroll() {
  if (lockCount === 0) document.body.style.overflow = 'hidden'
  lockCount += 1
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) document.body.style.overflow = ''
}
