<?php
/**
 * Plugin Name: SSSIHMS Whitefield — FAQ Chatbot
 * Description: Loads the FAQ chat bubble from chat.sssihms.org on whitefield.sssihms.org (blog 4).
 *              The bot answers only from the hospital knowledge base; see the sssihms-chatbot repo.
 * Author:      SSSIHMS Web
 * Version:     1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Where the chatbot backend and widget are served from. */
const SSSIHMS_WFD_CHATBOT_BASE = 'https://chat.sssihms.org';

/**
 * Print the widget config and script on every public Whitefield page. The
 * backend only accepts requests whose Origin is in its ALLOWED_ORIGIN list, and
 * answers this origin from the hospital knowledge base.
 */
function sssihms_wfd_chatbot() {
	if ( ! function_exists( 'get_current_blog_id' ) || 4 !== (int) get_current_blog_id() ) {
		return;
	}
	$text = array(
		'header'   => 'SSSIHMS Whitefield — Ask a question',
		'notice'   => 'Please do not enter your name, MRN, phone number, or any medical details here.',
		'greeting' => 'Hello! I can answer general questions about SSSIHMS Whitefield — departments, appointments, visiting hours, directions. How can I help?',
	);
	?>
<style id="sssihms-chatbot-css">
#sssihms-chat-bubble,#sssihms-chat-header,#sssihms-chat-send{background:#a4581f}
@media (max-width:980px){
 /* Sit above the sticky Call Help Desk bar (about 64px tall). */
 #sssihms-chat-bubble{bottom:80px}
 #sssihms-chat-panel{bottom:148px;max-height:calc(100vh - 200px)}
}
@media print{#sssihms-chat-bubble,#sssihms-chat-panel{display:none!important}}
</style>
<script>
window.SSSIHMS_CHATBOT_API = <?php echo wp_json_encode( SSSIHMS_WFD_CHATBOT_BASE ); ?>;
window.SSSIHMS_CHATBOT_TEXT = <?php echo wp_json_encode( $text ); ?>;
</script>
<script src="<?php echo esc_url( SSSIHMS_WFD_CHATBOT_BASE . '/widget/widget.js' ); ?>" defer></script>
	<?php
}
add_action( 'wp_footer', 'sssihms_wfd_chatbot', 100 );
