const additionalIn = ["Season Passes", "Programs", "Other (In)"];
const additionalOut = ["Ref Mileage", "Ref Fee", "Announcer", "Security", "50/50 Winner", "Photographer", "Other (Out)", "Missing $"];
const normalEvents = ["Admission", "50/50", "Apparel", "Chuck-A-Puck", "Score-O"];
let eventCount = 0;

function addEvent() {
  eventCount++;
  const today = new Date().toISOString().split('T')[0];
  const eventHtml = `
<div class="card event-card" data-event="${eventCount}">
  <div class="card-body">
    <button type="button" class="btn btn-sm btn-danger remove-btn">Remove Event</button>
    <h5 class="card-title">Event ${eventCount}</h5>
    <div class="row mb-3">
      <div class="col-12 col-md-5">
        <select class="form-select event-name is-invalid">
          <option value="">-- Select Event --</option>
          ${normalEvents.map(e=>`<option value="${e}">${e}</option>`).join("")}
          <optgroup label="Additional In">${additionalIn.map(e=>`<option value="${e}">${e}</option>`).join("")}</optgroup>
          <optgroup label="Additional Out">${additionalOut.map(e=>`<option value="${e}">${e}</option>`).join("")}</optgroup>
        </select>
		
        <input type="hidden" class="form-control event-date" value="${today}">
      </div>
      <div class="col-12 col-md-5 breakdown-section">
        <div class="input-group mb-1"><span class="input-group-text">Float</span><input type="number" class="form-control float" min="0" placeholder="0"></div>
      </div>
    </div>

    <!-- Breakdown Section -->
    <div class="breakdown-section">
		<div class="row mb-3">
		  <div class="col-9">
			<label class="form-label"><b>Is the float included with breakdown below?</b></label>
			<select class="form-select float-included">
			  <option value="Yes">Yes</option>
			  <option value="No">No</option>
			</select>			
		  </div>
		</div>
      <div class="row mb-3">
        <div class="col-12 col-md-5">
          <label class="form-label"><b>Coins</b></label>
          <div class="input-group mb-1"><span class="input-group-text">Nickels</span><input type="number" class="form-control nickels" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">Dimes</span><input type="number" class="form-control dimes" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">Quarters</span><input type="number" class="form-control quarters" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">Loonies</span><input type="number" class="form-control loonies" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">Toonies</span><input type="number" class="form-control toonies" min="0" placeholder="0"></div>
          <div class="mt-2"><strong>Total Coins: $<span class="total-coins">0.00</span></strong></div>
        </div>
        <div class="col-12 col-md-5">
          <label class="form-label"><b>Bills</b></label>
          <div class="input-group mb-1"><span class="input-group-text">$5</span><input type="number" class="form-control fives" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">$10</span><input type="number" class="form-control tens" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">$20</span><input type="number" class="form-control twenties" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">$50</span><input type="number" class="form-control fifties" min="0" placeholder="0"></div>
          <div class="input-group mb-1"><span class="input-group-text">$100</span><input type="number" class="form-control hundreds" min="0" placeholder="0"></div>
          <div class="mt-2"><strong>Total Bills: $<span class="total-bills">0.00</span></strong></div>
        </div>
      </div>
      <div class="mb-2 totals-row">Total Cash: $<span class="total-cash">0.00</span></div>
      <div class="row mb-3">
        <div class="col-12 col-md-5">
          <div class="input-group mb-1"><span class="input-group-text">EMT</span><input type="number" class="form-control emt" min="0" placeholder="0"></div>
        </div>
      </div>
    </div>

    <!-- Simple Section -->
    <div class="simple-section">
      <div class="row mb-3 additional-other">
        <div class="col-12 col-md-5">
          <div class="input-group mb-1"><span class="input-group-text">Name</span><input type="text" class="form-control other-name" placeholder="Required"></div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-12 col-md-5">
          <div class="input-group mb-1"><span class="input-group-text">Amount</span><input type="number" class="form-control amount" min="0" placeholder="0" step="0.01"></div>
        </div>
        <div class="col-12 col-md-5">
          <div class="input-group mb-1"><span class="input-group-text">Payment Type</span>
            <select class="form-select payment-type">
              <option>Cash</option><option>EMT</option><option>Cheque</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-2 totals-row">Overall <span class="total-event"></span>Total: $<span class="total-overall">0.00</span>
	<button type="button" class="btn btn-warning btn-sm clear-event">Clear Values</button>
	</div>
    
  </div>
</div>
  `;
  $("#events").append(eventHtml);
  attachEventHandlers($(`.event-card[data-event="${eventCount}"]`));
}

// --- Event Handlers & Calculation ---
function attachEventHandlers(card){
  function recalc() {
    if(card.find(".breakdown-section").is(":visible")){
      const nickels = parseFloat(card.find(".nickels").val()||0)*0.05;
      const dimes = parseFloat(card.find(".dimes").val()||0)*0.1;
      const quarters = parseFloat(card.find(".quarters").val()||0)*0.25;
      const loonies = parseInt(card.find(".loonies").val()||0)*1;
      const toonies = parseInt(card.find(".toonies").val()||0)*2;
      const totalCoins = nickels+dimes+quarters+loonies+toonies;
      const fives = parseInt(card.find(".fives").val()||0)*5;
      const tens = parseInt(card.find(".tens").val()||0)*10;
      const twenties = parseInt(card.find(".twenties").val()||0)*20;
      const fifties = parseInt(card.find(".fifties").val()||0)*50;
      const hundreds = parseInt(card.find(".hundreds").val()||0)*100;
      const totalBills = fives+tens+twenties+fifties+hundreds;
      const totalCash = totalCoins+totalBills;
      const emt = parseFloat(card.find(".emt").val()||0);
      const overall = totalCash + emt;
	  
      card.find(".total-coins").text(totalCoins.toFixed(2));
      card.find(".total-bills").text(totalBills.toFixed(2));
      card.find(".total-cash").text(totalCash.toFixed(2));
      card.find(".total-overall").text(overall.toFixed(2));	  
    } else {
      const amount = parseFloat(card.find(".amount").val()||0);
      card.find(".total-overall").text(amount.toFixed(2));
    }
		
	calculateTotals();
  }

  card.on("input change", "input, select", function(){
    recalc(); 
    validateForm();
  });

  card.find(".clear-event").on("click", function(){
    card.find("input:visible").val(""); 
    recalc(); 
    validateForm(); 
  });

  card.find(".form-select.event-name").on("change", function(){
    const val = $(this).val();
    card.find(".card-title").text("Event " + val);
    card.find(".total-event").text(val + " ");
    if(normalEvents.includes(val)) card.css("background-color","white");
    else if(additionalIn.includes(val)) card.css("background-color","#dbf1cc");
    else if(additionalOut.includes(val)) card.css("background-color","#f5c5c5");
    else card.css("background-color","white");

    card.find("input:visible").val("");
    card.find(".additional-other").hide();
    if(val.toLowerCase().includes("other")) card.find(".additional-other").show();
    if(normalEvents.includes(val)) {
      card.find(".breakdown-section").show();
      card.find(".simple-section").hide();
    } else {
      card.find(".breakdown-section").hide();
      card.find(".simple-section").show();
    }
    recalc(); 
    validateForm();
  });

  card.find(".remove-btn").on("click", function(){ 
    card.remove(); 
	recalc();
    validateForm(); 
  });
}

function calculateTotals()
{
	var totalFloat = 0,cashHandedIn = 0,emt = 0,overallRevenue = 0,cashPaidOut = 0;
	
	$(".total-cash").each(function() { 
		cashHandedIn += parseFloat($(this).text() || 0); 
	});
	
	$(".float:visible").each(function() {
		totalFloat += parseFloat($(this).val() || 0); 
	});
	
	$(".emt:visible").each(function() {
		emt += parseFloat($(this).val() || 0); 
	});
	
	$(".simple-section:visible").each(function() {
		var eventName = $(this).parent().find(".form-select.event-name").val();
		var paymentType = $(this).find(".payment-type").val();
		var amount = parseFloat($(this).find(".amount").val() || 0);
		
		if(additionalIn.includes(eventName)){
			if(paymentType == "Cash")
				cashHandedIn += amount;
			else
				emt += amount;
		}
		else{
			if(paymentType == "Cash"){
				cashHandedIn -= amount;
				
				if(!eventName.toLowerCase().includes("missing"))
					cashPaidOut += amount;
			}
			else
				emt -= amount;
		}
	});
	
	overallRevenue = cashHandedIn + emt - totalFloat + cashPaidOut;	

	var cashTotalIn = cashHandedIn + cashPaidOut;
	$(".overall-total-cash-amount").text(cashTotalIn.toFixed(2));
	$(".overall-total-revenue-amount").text(overallRevenue.toFixed(2));
}

// --- Form Validation ---
function validateForm() {
  let valid = true;
  const selectedEvents = [];

  const submitterField = $(".submitter");
  if(!submitterField.val().trim()){ 
    valid = false; 
    submitterField.addClass("is-invalid"); 
  } else { 
    submitterField.removeClass("is-invalid"); 
  }

  $(".event-card").each(function(){
    const $c = $(this);
    const val = $c.find(".event-name").val();
    if(!val){ 
      valid = false; 
      $c.find(".event-name").addClass("is-invalid"); 
    } else { 
      $c.find(".event-name").removeClass("is-invalid"); 

      // check duplicates
      if(selectedEvents.includes(val)){
        valid = false; 
        $c.find(".event-name").addClass("is-invalid");
      } else {
		  if(!val.toLowerCase().includes("other"))
			selectedEvents.push(val);
      }
    }

    // Other Name validation
    const otherNameField = $c.find(".other-name");
    if(val.toLowerCase().includes("other")){
      if(!otherNameField.val().trim()){ 
        valid=false; 
        otherNameField.addClass("is-invalid"); 
      } else { 
        otherNameField.removeClass("is-invalid"); 
      }
    } else { 
      otherNameField.removeClass("is-invalid"); 
    }
  });

  $("#cashForm button[type='submit']").prop("disabled", !valid);
}

//https://obfuscator.io/#code
// --- Initialization ---
$(document).ready(function(){ 
  $("#overlay").hide(); 
  addEvent(); 
  validateForm();
  
  $(".submitter").on("change", function(){
    validateForm();
  });
  
  $("#addEvent").on("click", addEvent);
  
  // --- Form Submission ---
	$(".btn-submit").on("click", function(e){
	  e.preventDefault(); 
	  $(".dn").hide();
	  
		// Get the reCAPTCHA response
		var response = grecaptcha.getResponse();
		if(response.length === 0) {
			$(".dn").show();
		}
		else{		
			$("#overlay").show();

			const events=[];
			$(".event-card").each(function(){
				const c=$(this);
				events.push({
					eventName: c.find(".event-name").val(),
					eventDate: c.find(".event-date").val(),
					startingFloat: parseInt(c.find(".float").val()||0),
					floatIncluded: c.find(".float-included").val(),
					nickels: parseInt(c.find(".nickels").val()||0),
					dimes: parseInt(c.find(".dimes").val()||0),
					quarters: parseInt(c.find(".quarters").val()||0),
					loonies: parseInt(c.find(".loonies").val()||0),
					toonies: parseInt(c.find(".toonies").val()||0),
					fives: parseInt(c.find(".fives").val()||0),
					tens: parseInt(c.find(".tens").val()||0),
					twenties: parseInt(c.find(".twenties").val()||0),
					fifties: parseInt(c.find(".fifties").val()||0),
					hundreds: parseInt(c.find(".hundreds").val()||0),
					cashTotal: parseFloat(c.find(".total-cash").text()),
					emt: parseFloat(c.find(".emt").val()||0),
					otherName: c.find(".other-name").val(),
					additionalAmountInOut: parseFloat(c.find(".amount").val()||0),
					paymentType: c.find(".payment-type").val(),
					overallTotal: parseFloat(c.find(".total-overall").text())
				});
			});

			const comments=$(".comments").val();
			const submitter=$(".submitter").val();
			const totalCashHandedIn = parseFloat($(".overall-total-cash-amount").text() || 0);
			const totalRevenue = parseFloat($(".overall-total-revenue-amount").text() || 0);
			const recaptchaToken = response;

			fetch("https://script.google.com/macros/s/AKfycbxvZRAezvpuxHF0qZnzKqarKksN2YCETBZUBsdo05sHWEa32YeSy4Qy0ckvgI7RW8lQ/exec", { 
				method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"},
				body: JSON.stringify({events, comments, submitter, totalCashHandedIn, totalRevenue, recaptchaToken})
			}).then(()=>{
				$("#overlay").hide();
				$("#cashForm").hide(); 
				$("#thankYou").show();
			}).catch(err=>{ 
				$("#overlay").hide(); 
				alert("Error submitting form: "+err.message); 
			});
		}
	});
});



