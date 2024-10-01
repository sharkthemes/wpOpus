<?php
/**
 * @package wpOpus
 * @category functions
 * @author wpOpus
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function wpopus_pre_dump($data)
{
    echo '<pre>';
    var_dump($data);
    echo '</pre>';
}

function wpopus_write_log($log)
{
    if (true === WP_DEBUG_LOG) {
        if (is_array($log) || is_object($log)) {
            error_log(print_r($log, true));
        } else {
            error_log($log);
        }
    }
}
