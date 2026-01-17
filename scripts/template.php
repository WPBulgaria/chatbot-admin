<?php
defined('ABSPATH') || exit;
$plugin_url = plugin_dir_url(dirname(__DIR__));
?>

<div id="wp-chatbot-admin-container"></div>
<script type="module" src="<?php echo esc_url($plugin_url . "/assets/admin__MAIN_JS__", ); ?>"></script>
<script>
    jQuery(document).ready(function($) {
        $("#wp-chatbot-admin-container").on("keyup", function(event) {
            event.stopPropagation();
        })

        $("#wp-chatbot-admin-container").on("keydown", function(event) {
            event.stopPropagation();
        })

        window.appHost = "<?php 
            $url = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://' . $_SERVER['HTTP_HOST'];
            echo $url; 
        ?>";

        /**
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "/wp-content/plugins/wpb-chatbot/assets/admin__STYLE_LINK1__");

        */

        let bodyLink = document.createElement("link");
        bodyLink.setAttribute("rel", "stylesheet");
        bodyLink.setAttribute("href", '<?php echo esc_url($plugin_url . "/assets/admin__STYLE_LINK__"); ?>');
        document.body.prepend(bodyLink);

        /**

        let style = document.createElement("style");
        style.innerHTML = ` `;


        let host = document.getElementById("wp-chatbot-admin-container");
        host.shadowRoot.prepend(link);
        host.shadowRoot.prepend(style);
        */
    });
</script>