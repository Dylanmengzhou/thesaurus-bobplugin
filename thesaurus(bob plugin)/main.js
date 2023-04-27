function supportLanguages() {
  return ["en", "zh-Hans"];
}

async function translate(query, completion) {
  var word = query.text;
  // check if the word is a single word or a sentence
  if (word.indexOf(" ") != -1) {
    completion({
      result: {
        from: "en",
        to: "zh-Hans",
        toParagraphs: ["暂不支持短语翻译，请输入单词。"],
      },
    });
  } else {
    var result = await $http.get({
      url: "https://api.api-ninjas.com/v1/thesaurus?word=" + word,
      header: {
        "X-Api-Key": "LAjLcST2s8rdbgRNKD7W0A==0oJ4gXikNjrjsoWC",
      },
    });
    // replace all the _ with a space
    result["data"]["synonyms"] = result["data"]["synonyms"].map(function (
      word
    ) {
      return word.replace(/_/g, " ");
    });
    result["data"]["antonyms"] = result["data"]["antonyms"].map(function (
      word
    ) {
      return word.replace(/_/g, " ");
    });
    completion({
      result: {
        from: "en",
        to: "zh-Hans",

        toDict: {
          word: query.text,
          parts: [
            {
              part: "同义词(synonyms)",
              means: result["data"]["synonyms"],
            },
            {
              part: "反义词(antonyms)",
              means: result["data"]["antonyms"],
            },
          ],
        },
      },
    });
  }
}
