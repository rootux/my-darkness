class API {
  static _getAntonym(word) {
    return axios.get(
      `https://api.datamuse.com/words?rel_ant=${word}`,
    );
  }

  static _getSimilar(word) {
    return axios.get(
      `https://api.datamuse.com/words?ml=${word}`,
    );
  }

  static async getSimilars(words) {
    const result = await Promise.all(words.map(word => {
        return API.getSimilar(word);
    }));
    // Flatten arrays
    const flattend = [].concat.apply([], result);
    // Unique
    return[...new Set(flattend)];
  }

  static async getSimilar(word) {
    const similar = await API._getSimilar(word);
    if (similar.data.length > 0) {
        // Only take top 3 elements
        return similar.data.slice(0, 3).map(sim => {
            if(sim['word']) { return sim['word']; }
        });
    }
  }

  static async getAntonyms(words) {
    const result = await Promise.all(words.map(word => {
      return API.getAntonym(word);
    }));
    // Flatten arrays
    const flattend = [].concat.apply([], result);
    // Unique
    return[...new Set(flattend)];
  }
  
  static async getAntonym(word) {
    const antonyms = await API._getAntonym(word);
    if (antonyms.data.length > 0) {
        const res = antonyms.data.map(antonym => {
            if(antonym['word']) { return antonym['word']; }
        });
        return res;
    }
  }
};
