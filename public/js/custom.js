const windowURL = window.location.origin;

// Tooltipster for heroes
$(document).ready(function() {
    $('.hero-tooltip').tooltipster({
        content: 'Loading...',
        theme: 'tooltipster-borderless',
        animation: 'fade',
        delay: 200,
        trigger: 'hover',
        functionBefore: function(instance, helper) {
            let $origin = $(helper.origin);
            let heroName = $origin.attr('data-name');
            if ($origin.data('loaded') !== true) {   
                $.ajax({
                    type: "GET",
                    url: "/heroes/" + heroName,
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        instance.content(renderHeroToolTip(data));
                        // this remembers that the data has been loaded
                        $origin.data('loaded', true);
                    }
                });
            }
        },
        contentAsHTML: true
    });
});

// Tooltipster for maps
$(document).ready(function() {
    $('.map-tooltip').tooltipster({
        content: 'Loading...',
        theme: 'tooltipster-borderless',
        animation: 'fade',
        delay: 200,
        trigger: 'hover',
        functionBefore: function(instance, helper) {
            let $origin = $(helper.origin);
            let mapName = $origin.attr('data-name');
            if ($origin.data('loaded') !== true) {   
                $.ajax({
                    type: "GET",
                    url: "/maps/" + mapName,
                    cache: false,
                    success: function(data) {
                        console.log(data);
                        instance.content(renderMapToolTip(data));
                        // this remembers that the data has been loaded
                        $origin.data('loaded', true);
                    }
                });
            }
        },
        contentAsHTML: true
    });
});

function renderHeroToolTip(data) {
    console.log(data);
    let hero = data.hero;
    return `
    <div class="row">
        <div class="col-md-6">
            <img class="nk-image-fit" src="/heroes/portrait/${hero.pictureName}.jpg" width="350" height="200">
        </div>
        <div class="col-md-5">
            <h3>${hero.name}</h3>
            <span><span class="text-main-1 upper">Role: </span>${hero.role}</span><br>
            <span><span class="text-main-1 upper">Real Name: </span>${hero.realName}</span><br>
            <span><span class="text-main-1 upper">Age: </span>${hero.age}</span><br>
            <span><span class="text-main-1 upper">Occupation: </span>${hero.occupation}</span><br>
            <span><span class="text-main-1 upper">Base of Operations: </span>${hero.baseOfOperations}</span><br>
            <span><span class="text-main-1 upper">Affiliation: </span>${hero.affiliation}</span><br>
        </div>
    </div>
    <div class="nk-gap"></div>
    <div class="col-md-10">
        <h4 class="h-overview">Overview</h4>
        <p class="overview">${hero.overview}</p>
    </div>
    `;    
}


function renderMapToolTip(data) {
    let map = data.map;
    return `
    <div class="row">
        <div class="col-md-7">
            <img class="nk-image-fit" src="/maps/${map.pictureName}.jpg" width="400" height="200">
        </div>
        <div class="col-md-4">
            <h3 class="nk-decorated-h2">${map.name}</h3>
            <span><span class="text-main-1 upper">Mode: </span>${map.mode}</span><br>
            <span><span class="text-main-1 upper">Location: </span>${map.location}</span><br>
            <span><span class="text-main-1 upper">Terrain: </span>${map.terrain}</span><br>
        </div>
    </div>
    <div class="nk-gap"></div>
    <div class="col-md-10">
        <h4 class="h-overview">Overview</h4>
        <p class="overview">${map.description}</p>
    </div>
    `;
}

// fadeIn & fadeOut effects for login/registration modal 
$(document).ready(function() {
    $('#signupModal').click(function() {
        $('#login-modal-content').fadeOut('fast', function() {
            $('#signup-modal-content').fadeIn('fast');
        });
    });

    $('#loginModal').click(function() {
        $('#signup-modal-content').fadeOut('fast', function() {
            $('#login-modal-content').fadeIn('fast');
        });
    });
}); 


// User Validation
function formatError(){
	let elementArray = ['#email', '#username', '#password', '#confirmPassword']	;
	let errorCount = 0,
		filledCount = 0;		
		elementArray.forEach(element => {			
			if($(element).val() !== ""){
				filledCount++;
			}
			if ($(element).hasClass('error')){
					let failureHtml =   
						`<span class="glyphicon glyphicon-remove form-control-feedback feedback error" aria-hidden="true"></span>` +
				        `<span id="inputError2Status" class="sr-only feedback">(error)</span>`;

					let parent = $(element).parent();
					$(element).removeClass('valid');
					$(parent).children('.feedback').remove();
					$(parent).removeClass('has-success').addClass('has-danger');
					$(parent).append(failureHtml) ;
					$('#signupButton').prop('disabled', true);
					errorCount++;
			}
		});
		if(errorCount == 0 && filledCount === 4){
			$('#signupButton').prop('disabled', false);
		} 
}

function displayError(){
	$('input').on('keydown', () => {
		setTimeout(formatError, 100);
	});

	$('input').on('focusout', () => {
		setTimeout(formatError, 100);
	});
}

function validateForm(){
	$('#signup-form').validate({
		rules: {
			password: {
				required: true,
				minlength: 6
			},
			confirmPassword: {
                required: true,
                equalTo: "#password"
			},
			email: {
				required: true,
				email: true,
            },
            username: {
                required: true,
                minlength: 3
            }
		},
		// changes success messages
		success: function(label){
    		let successHtml =   
	    		`<span class="glyphicon glyphicon-ok form-control-feedback feedback" aria-hidden="true"></span>` +
                `<span id="inputSuccess2Status" class="sr-only feedback">(success)</span>`;

    		if (label[0].htmlFor === 'email') {			    
			    let data = {
					username: $('#username').val()
				};

				// This provides immediate feedback to users about whether the username has already been taken
				$.ajax({
					type: 'post',
					url: windowURL + '/users/username',
					data: JSON.stringify(data),
					contentType: 'application/json',
					success: function(data){
						if (data.message === 'Username has already been used to create an account'){
							    let parent = $('#username').parent();
			    				$(parent).removeClass('has-success');
			    				$(parent).children('.feedback').remove();
								$('#email').removeClass('valid').addClass('error');
								$('#email-error').text(data.message);
						}
						else{
				    		let parent = $(label).parent();
				    		$(parent).removeClass('has-danger').addClass('has-success');
				    		$(parent).children('.feedback').remove();
				    		$(parent).append(successHtml);
				    		$(label).remove();
						}
					}
				});
    		}
    		else {
	    		let parent = $(label).parent();
	    		$(parent).removeClass('has-danger').addClass('has-success');
	    		$(parent).children('.feedback').remove();
	    		$(parent).append(successHtml);
	    		$(label).remove();
    		}       
		},
		// changes error messages
		messages: {
            username: {
                required: 'Plase enter a username',
                minlength: 'Your username must be at least 3 characters'
            },
			password: "Password must be at least 6 characters",
			confirmPassword: "Please enter a matching password"
		}
	});     
}

// AJAX call to /users/login
function login() {
    $('#loginButton').on('click', function(e) {
        e.preventDefault();
        let userData = {
            'username': $('#login-username').val(),
            'password': $('#login-password').val()
        }
        $.ajax({
            type: 'post',
            url: windowURL + '/auth/login',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(data) {
                window.location.href = windowURL + '/profile';  // redirects to homepage
            },
            error: function(err) {
                alert('Wrong username/password!');
            }
        });
    });
}

// AJAX call to /users/signup
function signup() {
    $('#signupButton').on('click', function(e) {
        e.preventDefault();
        // Serializes array into an array of objects, ready to be encoded as a JSON string
        let formData = {
            'email' : $('input[name=email]').val(),
            'username' : $('#username').val(),
            'password' : $('#password').val(),
            'confirmPassword' : $('input[name=confirmPassword]').val()
        };
        $.ajax({
            url: windowURL + '/users/signup',
            type: 'post',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(data) {
                console.log('1st ajax');
                let loginData = {
                    username: formData.username,
                    password: formData.password
                };
                // Signs in user on successful registration
                $.ajax({
                    type: 'post',
                    url: windowURL + '/auth/login',
                    data: JSON.stringify(loginData),
                    contentType: 'application/json',
                    success: function(data) {
                        window.location.href = windowURL + '/profile';
                        console.log('success');
                    }
                });
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
}


$(() => {
    login();
    signup();
    validateForm();
    displayError();
});