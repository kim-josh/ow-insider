const windowURL = window.location.origin;

// Display user information - email, username, joinDate
function getUserData(callback){
    $.ajax({
        type: 'get',
        url: windowURL + '/users/me',
        success: function(data){
            callback(data);
        },
        error: function(err){
            window.location.href = windowURL + '/404';
        }
    });
}

function displayUserData(data){
    let formatDate = $.format.date(data.user.joinDate, "MMMM D, yyyy");
    $('#profileImage').append(`<img src="/heroes/soldier76icon.png"></img>`);
    $("#username").append(`<p>${data.user.username}</p>`);
    $('#email').append(`<p>${data.user.email}</p>`);
    $('#joinDate').append(`<p>Joined: ${formatDate}</p>`);
}

function getAndDisplayUserData(){
    getUserData(displayUserData);
}


// Signout
function signout(){
    $('#logOutButton').click((event) => {
        if(confirm('Log out?')){
            $.ajax({
                type: 'get',
                url: windowURL + '/logout',
                success: function(data) {
                    window.location.href = windowURL + data.redirect;
                }
            });
        }
    });
}

$(() => {
	getAndDisplayUserData();
	signout();
});

// Change passwords page 
function format(){
	let elementArray = ['#currentPassword', '#newPassword', '#confirmNewPassword'];
	
	let errorCount = 0,
		filledCount = 0;
	
		elementArray.forEach(element => {
			
			if($(element).val() !== ""){
				filledCount++;
			} 

			else if ($(element).val() == ''){
				let parent = $(element).parent();
				$(element).removeClass('valid');
				$(element).removeClass('error');
				$(parent).children('.feedback').remove();
				$(parent).removeClass('has-success');
				$(parent).removeClass('has-danger');
				$('#submitButton').prop('disabled', true);
				errorCount++;
			}

			if ($(element).hasClass('error')){
					let parent = $(element).parent();
					$(element).removeClass('valid');
					$(parent).children('.feedback').remove();
					$(parent).removeClass('has-success').addClass('has-danger');
					$('#submitButton').prop('disabled', true);
					errorCount++;
			}
		});

		if(errorCount == 0 && filledCount === 3){
			$('#submitButton').prop('disabled', false);
		} 
}

function displayError(){
	$('input').on('keydown', () => {
		setTimeout(format, 100);
	});
}

function validateForm(){
	$('#changePassword').validate({
		rules: {
			currentPassword: "required",
			newPassword: {
				required: true,
				minlength: 6
			},
			confirmNewPassword: {
				equalTo: "#newPassword"
			}
		},

		// changes success messages
		success: function(label){
    		let successHtml =   
	    		`<span class="glyphicon glyphicon-ok form-control-feedback feedback" aria-hidden="true"></span>` +
				`<span id="inputSuccess2Status" class="sr-only feedback">(success)</span>`;
	    		let parent = $(label).parent();
	    		$(parent).removeClass('has-danger').addClass('has-success');
	    		$(parent).children('.feedback').remove();
	    		$(parent).append(successHtml);
	    		$(label).remove();       
		},
		// changes error messages
		messages: {
			currentPassword: "Please enter your current password",
			newPassword: "Please enter a new password with 8 characters",
			confirmNewPassword: "Please enter a matching password"
		}
	});         
}

function changePassword(){
	$("#submitButton").on('click', (e) => {
		e.preventDefault();
		let currentPassword = $('#currentPassword').val();
		let loginData;
		let newPasswordData;
		let id;		
		
		if($('#newPassword').val() == $('#confirmNewPassword').val()){
			//follows pattern get user info to get username > logout > login with provided current password
			//if successfully logged in then password is updated
			$.ajax({
				type: 'get',
				url: windowURL + '/users/me',
				success: function(data){
					let username = data.user.username;
					loginData = {
						username: username,
						password: currentPassword
					};
					id = data.user.id;
					newPasswordData = {
						id: id, 
						password: $('#newPassword').val()
					};
					$.ajax({
						type: 'get',
						url: windowURL + '/logout',
						success: function(){
							$.ajax({
								type: 'post',
								url: windowURL + '/auth/login',
								data: JSON.stringify(loginData),
								contentType: 'application/json',
								success: function(data){
									$.ajax({
										type: 'put',
										url: windowURL + `/users/${id}`,
										data: JSON.stringify(newPasswordData),
										contentType: 'application/json',
										success: function(data){
											alert('Password successfully changed');
											window.location.href = windowURL + '/profile';
										}
									});
								},
								error: function(err){
									alert('Something went wrong. Try again!')
									window.location.href = windowURL + '/profile';
								}
							});
						}
					});
				}
			});
		}

	});
}


$(() => {
	validateForm();
	displayError();
	changePassword();
});