module.exports = class Friend {

  constructor(user, table) {
    this.user = user;
    this.table = table
  }

  getFriendsFromUserId() {
    if (this.user.following && this.user.following.length) {
      for (let i = 0, len = this.user.following.length; i < len; i++) {
        if (this.user.following[i].statut == "accepted") {
          this.table.push(this.user.following[i].userId);
        }
      }
    }
  }
}

