import $ from "jquery";

$.fn.mailgun_validator = function(options) {
    return this.each(function() {
        var thisElement = $(this);
        thisElement.focusout(function(e) {
            //Trim string and autocorrect whitespace issues
            var elementValue = thisElement.val();
            elementValue = $.trim(elementValue);
            thisElement.val(elementValue);

            //Attach event to options
            options.e = e;

            run_validator(elementValue, options, thisElement);
        });
    });
};

function run_validator(address_text, options, element) {
    //Abort existing AJAX Request to prevent flooding
    if(element.mailgunRequest) {
        element.mailgunRequest.abort();
        element.mailgunRequest = null;
    }

    // don't run validator without input
    if (!address_text) {
        return;
    }

    // validator is in progress
    if (options && options.in_progress) {
        options.in_progress(options.e);
    }

    // don't run dupicate calls
    if (element.mailgunLastSuccessReturn) {
        if (address_text == element.mailgunLastSuccessReturn.address) {
            if (options && options.success) {
                options.success(element.mailgunLastSuccessReturn, options.e);
            }
            return;
        }
    }

    // length and @ syntax check
    var error_message = false;
    if (address_text.length > 512) {
        error_message = 'Email address exceeds maxiumum allowable length of 512.';
    } else if (1 !== address_text.split('@').length-1) {
        error_message = 'Email address must contain only one @.';
    }

    if (error_message) {
        if (options && options.error) {
            options.error(error_message, options.e);
        } else {
            if (console) console.log(error_message);
        }
        return;
    }

    // require api key
    if (options && options.api_key == undefined) {
        if (console) {
            console.log('Please pass in api_key to mailgun_validator.');
        }
    }

    // timeout incase of some kind of internal server error
    var timeoutID = setTimeout(function() {
        error_message = 'Error occurred, unable to validate address.';
        if (!success) {
            //Abort existing AJAX Request for a true timeout
            if (element.mailgunRequest) {
                element.mailgunRequest.abort();
                element.mailgunRequest = null;
            }

            if (options && options.error) {
                options.error(error_message, options.e);
            } else {
                if (console) console.log(error_message);
            }
        }
    }, 30000); //30 seconds

    // make ajax call to get validation results
    element.mailgunRequest = $.ajax({
        type: "GET",
        url: 'https://api.mailgun.net/v3/address/validate?callback=?',
        data: { address: address_text, api_key: options.api_key },
        dataType: "jsonp",
        crossDomain: true,
        success: function(data, status_text) {
            clearTimeout(timeoutID);

            element.mailgunLastSuccessReturn = data;
            if (options && options.success) {
                options.success(data, options.e);
            }
        },
        error: function(request, status_text, error) {
            clearTimeout(timeoutID);
            error_message = 'Error occurred, unable to validate address.';

            if (options && options.error) {
                options.error(error_message, options.e);
            } else {
                if (console) {
                    console.log(error_message);
                }
            }
        }
    });
}

// while the lookup is performing
function validation_in_progress() {
    $('#newsletter-status').html("<img src='/images/ajax-loader.gif' height='16'/>");
    $('#newsletter-cta').css('cursor', 'progress').attr("disabled", true);
}

// if email successfull validated
function validation_success(data_status) {
    $('#newsletter-status').html(get_suggestion_str(data_status['is_valid'], data_status['did_you_mean']));
    $('#newsletter-cta').removeAttr('disabled').css('cursor', 'pointer');
}

// if email is invalid
function validation_error(error_message) {
    $('#newsletter-status').html(error_message);
    $('#newsletter-cta').css('cursor', 'not-allowed');
}

// suggest a valid email
function get_suggestion_str(is_valid, alternate) {
    if (is_valid) {
        var result = '<span class="success">Address seems valid 👍 Go!</span>';
        if (alternate) {
            result += '<br/><span class="warning"> (Though did you mean <em>' + alternate + '</em>? 😎)</span>';
        }
        return result
    } else if (alternate) {
        return '<span class="warning">Did you mean <em>' + alternate + '</em>? 🤔</span>';
    } else {
        $("input[name='EMAIL']").val('');
        return '<span class="error">Address is invalid. 😿</span>';
    }
}

export default function () {
    $('#newsletter-field').on('keypress', function (e) {
        $('#newsletter-cta').removeAttr('disabled');
        if (e.keycode == 13) {
            $('#newsletter-field').trigger('focusout');
            return false;
        }
    });
    
    $("#newsletter-cta").on('hover', function () {
        $('#newsletter-field').trigger('focusout');
        return false;
    });
    
    // capture clicks on validate and do nothing
    $(".newsletter-form form").on('submit', function (e) {
        e.preventDefault();
        const url_location = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    
        $.ajax({
            url: url_location + "/subscribe/",
            dataType: 'json',
            method: 'GET',
            data: {
                EMAIL: $("input[name='EMAIL']").val(),
                SOURCE: $("input[name='SOURCE']").val()
            }
        }).done(function (result) {
            console.log("Ajax method newsletter result: " + result);
            trackNewsletter(
                'newsletter',
                'newsletter_signup',
                'fromHomepage'
            );
        }).fail(function (jqxhr, textStatus, error) {
            console.log(jqxhr);
        }).always(function () {
            $("input[name='EMAIL']").val('');
            $("input[name='EMAIL']").closest('.newsletter-form').append('<p class="sub-success">Subscription Succeeded! ✅</p>');
            $('#newsletter-status').remove();
        });
    });
    
    // attach jquery plugin to validate address
    $('#newsletter-field').mailgun_validator({
        api_key: 'pubkey-fb03d9341661be1fc385555596902c97',
        in_progress: validation_in_progress,
        success: validation_success,
        error: validation_error,
    });
}