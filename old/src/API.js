const request = require('request-promise');
const axios = require('axios');

class API {
    static getAntonym(word) {
        return request({
            url: `https://api.datamuse.com/words?rel_ant=${word}`,
            method: 'GET',
        });
    }

    static getSimilar(word) {
      return request({
        url: `https://api.datamuse.com/words?ml=${word}`,
        method: 'GET',
    });
    }
}

module.exports = API;
