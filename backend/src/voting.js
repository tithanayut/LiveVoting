class Voting {
  constructor() {
    this.voting = [];
  }

  getAllVotings() {
    return this.voting.slice();
  }

  create_voting(id, topic) {
    if (!id || !topic) {
      return { errors: ["ID and Topic cannot be blank"] };
    }
    if (this.voting.some((voting) => voting.id == id)) {
      return { errors: ["Voting ID duplicate"] };
    }

    this.voting.push({
      id,
      topic,
      voter: [],
      yes: 0,
      no: 0,
      nah: 0,
    });
    return { id, topic };
  }

  vote(id, voter, vote) {
    if (vote !== "yes" && vote !== "no" && vote !== "nah") {
      return { errors: ["Invalid voting option"] };
    }
    if (!id || !voter || !vote) {
      return { errors: ["ID and Vote cannot be blank"] };
    }

    const votingIndex = this.voting.findIndex((voting) => voting.id == id);
    if (votingIndex === -1) {
      return { errors: ["Voting ID not found"] };
    }

    this.voting[votingIndex].voter.push(voter);
    this.voting[votingIndex][vote] += 1;

    return {
      id,
      yes: this.voting[votingIndex].yes,
      no: this.voting[votingIndex].no,
      nah: this.voting[votingIndex].nah,
    };
  }
}

module.exports.Voting = Voting;
