let score = 15;
function weightedRandom(items, weights) {
  if (items.length !== weights.length) {
    throw new Error("Items and weights arrays must have the same length.");
  }
  const cumulativeWeights = [];
  let sum = 0;
  for (const weight of weights) {
    sum += weight;
    cumulativeWeights.push(sum);
  }
  const randomNumber = Math.random() * sum;
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (randomNumber < cumulativeWeights[i]) {
      return items[i];
    }
  }
}

function addButton(buttonid, stats = []) {
  const newButton = $("body").append(`<div class="button" type="${buttonid}"></div>`).children().last();
  newButton.css({
    top: Math.floor(Math.random() * (window.innerHeight - 100 * 2) + 100),
    left: Math.floor(Math.random() * (window.innerWidth - 100 * 2) + 100)
  });

  // Only set initial stats if provided
  if (stats.length) {
    newButton.data("stats", stats);
  }

  switch (buttonid) {
    case 1:
      newButton.text("Spawn 2 Buttons");
      break;
    case 2:
      if (!stats.length) {
        const amount = Math.floor(Math.random() * 10 + 1);
        stats = [amount];
        newButton.data("stats", stats);
      }
      newButton.text("+" + stats[0]);
      newButton.css("background-color", "#4287f5");
      break;
    case 3:
      if (!stats.length) {
        const stock = Math.floor(Math.random() * 5 + 1);
        const buy = Math.floor(Math.random() * 5 + 6);
        stats = [stock, buy];
        newButton.data("stats", stats);
      }
      newButton.text("Buy (" + stats[1] + ")");
      newButton.css("background-color", "#6d808a");
      sideText(newButton, "Stock: " + stats[0], "font-size:15px");
      break;
    case 4:
      newButton.text("Gamble");
      newButton.css("background-color", "#ffcf24");
      sideText(newButton, "50% to x3 or /2 buttons", "font-size:15px");
      break;
    case 5:
      newButton.text("x2 Score");
      newButton.css("background-color", "#21ffbc");
      break;
    default:
      break;
  }
}


function sideText(jquery, text, css) {
  if ($(jquery).find("div").length) {
    $(jquery).find("div").html(`<div style="${css}">${text}</div>`); // Use .find() to target child div
  } else {
    $(jquery).append(`<div style="${css}">${text}</div>`);
  }
}

function deleteButton(jquery) {
  $(jquery).remove();
}
$(document).ready(function() {
  addButton(1); // Initially add a button
  addButton(3);
  $(".score").text(score);
  $('body').on("click", ".button[type=1]", function() {
    addButton(weightedRandom([1, 2, 3, 4, 5], [9, 13, 2, 2, 1]));
    addButton(weightedRandom([1, 2, 3, 4, 5], [9, 13, 3, 2, 2]));
    deleteButton(this);
  });
  $('body').on("click", ".button[type=2]", function() {
    amount = $(this).data("stats")[0];
    score += amount; // Update score based on the button clicked
    $(".score").text(score); // Display updated score
    deleteButton(this);
  });
  $('body').on("click", ".button[type=3]", function() {
    let stock = $(this).data("stats")[0]; // Get the stock value
    let buy = $(this).data("stats")[1]; // Get the buy cost
    if (score >= buy && stock > 0) {
      score -= buy;
      stock--;
      // Update button with new stock and maintain the same buy price
      $(this).data("stats", [stock, buy]); // Update stock data
      sideText($(this), "Stock: " + stock, "font-size:15px");
      $(".score").text(score);
      // Possibly add new button on successful purchase
      addButton(weightedRandom([1, 2, 3], [11, 13, 2]));
      if (stock <= 0) {
        deleteButton(this)
      }
    }
  });
  $('body').on("click", ".button[type=4]", function() {
    if (Math.random() < 0.5) {
      score *= 3;
      $(".score").text(score);
    } else {
      $(".button:even").remove();
    };
    deleteButton(this)
  });
  $('body').on("click", ".button[type=5]", function() {
    score *= 2; // Update score based on the button clicked
    $(".score").text(score); // Display updated score
    deleteButton(this);
  });
});