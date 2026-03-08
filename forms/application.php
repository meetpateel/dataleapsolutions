<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace with your real receiving email address
  $receiving_email_address = 'meet.pateel@gmail.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $application = new PHP_Email_Form;
  $application->ajax = true;

  $application->to = $receiving_email_address;
  $application->from_name = $_POST['name'];
  $application->from_email = $_POST['email'];
  $application->subject = 'Career Application: ' . $_POST['position'] . ' - ' . $_POST['name'];

  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  /*
  $application->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

  $application->add_message( $_POST['name'], 'Applicant Name');
  $application->add_message( $_POST['email'], 'Email');
  $application->add_message( $_POST['phone'], 'Phone');
  $application->add_message( $_POST['position'], 'Position Applied For');
  $application->add_message( isset($_POST['linkedin']) ? $_POST['linkedin'] : 'Not provided', 'LinkedIn Profile');
  $application->add_message( $_POST['message'], 'Cover Letter / Message', 10);

  echo $application->send();
?>
