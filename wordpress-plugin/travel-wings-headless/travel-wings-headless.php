<?php
/**
 * Plugin Name: Travel Wings Headless
 * Description: Registers Tours CPT, ACF field groups, and exposes everything via REST API for Astro frontend.
 * Version: 1.0.0
 * Author: Travel Wings
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ─── 1. Register Tours Custom Post Type ───────────────────────────────────────

add_action( 'init', function () {
    register_post_type( 'tours', array(
        'label'         => 'Tours',
        'labels'        => array(
            'name'          => 'Tours',
            'singular_name' => 'Tour',
            'add_new_item'  => 'Add New Tour',
            'edit_item'     => 'Edit Tour',
            'new_item'      => 'New Tour',
            'view_item'     => 'View Tour',
            'search_items'  => 'Search Tours',
        ),
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'tour',
        'graphql_plural_name' => 'tours',
        'rest_base'     => 'tours',
        'has_archive'   => false,
        'rewrite'       => array( 'slug' => 'tours' ),
        'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'menu_icon'     => 'dashicons-airplane',
        'menu_position' => 5,
    ) );
} );

// ─── 2. Flush rewrite rules on activation ─────────────────────────────────────

register_activation_hook( __FILE__, function () {
    // Register CPT first so rewrite rules are available
    register_post_type( 'tours', array(
        'public'       => true,
        'show_in_rest' => true,
        'rewrite'      => array( 'slug' => 'tours' ),
        'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
    ) );
    flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, function () {
    flush_rewrite_rules();
} );

// ─── 3. ACF Field Groups (programmatic — no DB, no UI clutter) ────────────────

add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_local_field_group' ) ) return;

    acf_add_local_field_group( array(
        'key'              => 'group_tour_details',
        'title'            => 'Tour Details',
        'active'           => true,
        'position'         => 'normal',
        'show_in_rest'     => true,
        'show_in_graphql'  => true,
        'graphql_field_name' => 'tourDetails',
        'location' => array(
            array(
                array(
                    'param'    => 'post_type',
                    'operator' => '==',
                    'value'    => 'tours',
                ),
            ),
        ),
        'fields' => array(

            // ── Basic Info ──────────────────────────────────────────────────
            array(
                'key'   => 'field_tw_destination',
                'label' => 'Destination',
                'name'  => 'destination',
                'type'  => 'text',
            ),
            array(
                'key'   => 'field_tw_region',
                'label' => 'Region',
                'name'  => 'region',
                'type'  => 'text',
            ),
            array(
                'key'     => 'field_tw_category',
                'label'   => 'Category',
                'name'    => 'category',
                'type'    => 'select',
                'choices' => array(
                    'umrah'         => 'Umrah',
                    'hajj'          => 'Hajj',
                    'vacation'      => 'Vacation',
                    'air-ticketing' => 'Air Ticketing',
                    'cruise'        => 'Cruise',
                ),
                'default_value' => 'vacation',
                'return_format' => 'value',
            ),
            array(
                'key'   => 'field_tw_duration',
                'label' => 'Duration (label)',
                'name'  => 'duration',
                'type'  => 'text',
                'placeholder' => '10 Days 9 Nights',
            ),
            array(
                'key'   => 'field_tw_duration_days',
                'label' => 'Duration (days)',
                'name'  => 'duration_days',
                'type'  => 'number',
                'min'   => 1,
            ),
            array(
                'key'   => 'field_tw_rating',
                'label' => 'Rating',
                'name'  => 'rating',
                'type'  => 'number',
                'min'   => 1,
                'max'   => 5,
                'step'  => 0.5,
            ),
            array(
                'key'   => 'field_tw_group_size',
                'label' => 'Group Size',
                'name'  => 'group_size',
                'type'  => 'text',
                'placeholder' => 'Up to 40 pilgrims',
            ),

            // ── Images ──────────────────────────────────────────────────────
            array(
                'key'           => 'field_tw_hero_image',
                'label'         => 'Hero Image',
                'name'          => 'hero_image',
                'type'          => 'image',
                'return_format' => 'array',
                'preview_size'  => 'medium',
            ),
            array(
                'key'           => 'field_tw_gallery',
                'label'         => 'Gallery',
                'name'          => 'gallery',
                'type'          => 'gallery',
                'return_format' => 'array',
                'preview_size'  => 'medium',
                'min'           => 0,
                'max'           => 20,
            ),

            // ── Highlights ──────────────────────────────────────────────────
            array(
                'key'        => 'field_tw_highlights',
                'label'      => 'Highlights',
                'name'       => 'highlights',
                'type'       => 'repeater',
                'layout'     => 'table',
                'min'        => 0,
                'sub_fields' => array(
                    array(
                        'key'   => 'field_tw_highlight_item',
                        'label' => 'Item',
                        'name'  => 'item',
                        'type'  => 'text',
                    ),
                ),
            ),

            // ── Itinerary ───────────────────────────────────────────────────
            array(
                'key'        => 'field_tw_itinerary',
                'label'      => 'Itinerary',
                'name'       => 'itinerary',
                'type'       => 'repeater',
                'layout'     => 'block',
                'min'        => 0,
                'sub_fields' => array(
                    array(
                        'key'   => 'field_tw_itin_day',
                        'label' => 'Day',
                        'name'  => 'day',
                        'type'  => 'number',
                        'min'   => 1,
                    ),
                    array(
                        'key'   => 'field_tw_itin_title',
                        'label' => 'Title',
                        'name'  => 'title',
                        'type'  => 'text',
                    ),
                    array(
                        'key'         => 'field_tw_itin_activities',
                        'label'       => 'Activities',
                        'name'        => 'activities',
                        'type'        => 'textarea',
                        'placeholder' => 'One activity per line',
                        'rows'        => 4,
                    ),
                ),
            ),

            // ── Inclusions ──────────────────────────────────────────────────
            array(
                'key'        => 'field_tw_inclusions',
                'label'      => 'Inclusions',
                'name'       => 'inclusions',
                'type'       => 'repeater',
                'layout'     => 'table',
                'min'        => 0,
                'sub_fields' => array(
                    array(
                        'key'   => 'field_tw_inclusion_item',
                        'label' => 'Item',
                        'name'  => 'item',
                        'type'  => 'text',
                    ),
                ),
            ),

            // ── Exclusions ──────────────────────────────────────────────────
            array(
                'key'        => 'field_tw_exclusions',
                'label'      => 'Exclusions',
                'name'       => 'exclusions',
                'type'       => 'repeater',
                'layout'     => 'table',
                'min'        => 0,
                'sub_fields' => array(
                    array(
                        'key'   => 'field_tw_exclusion_item',
                        'label' => 'Item',
                        'name'  => 'item',
                        'type'  => 'text',
                    ),
                ),
            ),

            // ── FAQs ────────────────────────────────────────────────────────
            array(
                'key'        => 'field_tw_faqs',
                'label'      => 'FAQs',
                'name'       => 'faqs',
                'type'       => 'repeater',
                'layout'     => 'block',
                'min'        => 0,
                'sub_fields' => array(
                    array(
                        'key'   => 'field_tw_faq_question',
                        'label' => 'Question',
                        'name'  => 'question',
                        'type'  => 'text',
                    ),
                    array(
                        'key'   => 'field_tw_faq_answer',
                        'label' => 'Answer',
                        'name'  => 'answer',
                        'type'  => 'textarea',
                        'rows'  => 3,
                    ),
                ),
            ),

            // ── Tags ────────────────────────────────────────────────────────
            array(
                'key'         => 'field_tw_tags',
                'label'       => 'Tags',
                'name'        => 'tags',
                'type'        => 'text',
                'placeholder' => 'spiritual, religious, saudi-arabia',
                'instructions'=> 'Comma separated tags',
            ),

        ), // end fields
    ) ); // end acf_add_local_field_group
} );

// ─── 4. REST API — itinerary activities string → array ────────────────────────
// Activities field textarea mein "one per line" store hoti hai.
// REST response mein automatically array mein convert kar deta hoon.

add_filter( 'acf/format_value/type=repeater', function ( $value, $post_id, $field ) {
    if ( $field['name'] !== 'itinerary' || ! is_array( $value ) ) return $value;

    foreach ( $value as &$row ) {
        if ( isset( $row['activities'] ) && is_string( $row['activities'] ) ) {
            $row['activities'] = array_values(
                array_filter(
                    array_map( 'trim', explode( "\n", $row['activities'] ) )
                )
            );
        }
    }
    return $value;
}, 10, 3 );

// Tags string → array in REST response
add_filter( 'acf/format_value/name=tags', function ( $value ) {
    if ( ! is_string( $value ) || empty( $value ) ) return array();
    return array_values( array_filter( array_map( 'trim', explode( ',', $value ) ) ) );
} );

// ─── 5. CORS — allow Astro frontend to call the API ───────────────────────────

add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', function ( $value ) {
        $allowed_origins = array(
            'https://travelwingsusa.com',
            'https://www.travelwingsusa.com',
            'http://localhost:4321', // Astro dev server
        );

        $origin = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';

        if ( in_array( $origin, $allowed_origins, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
        }

        header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
        header( 'Access-Control-Allow-Credentials: true' );
        header( 'Access-Control-Allow-Headers: Authorization, Content-Type' );

        return $value;
    } );
}, 15 );

// ─── 6. Disable WordPress frontend (headless — no theme needed) ───────────────

add_action( 'template_redirect', function () {
    // Only block frontend if not admin, not REST, not login page
    if ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) return;

    // Redirect all frontend requests to admin
    wp_redirect( admin_url() );
    exit;
} );

// ─── 7. Contact Form — REST endpoint ──────────────────────────────────────────

add_action( 'rest_api_init', function () {
    register_rest_route( 'travel-wings/v1', '/inquiry', array(
        'methods'             => 'POST',
        'callback'            => 'tw_handle_inquiry',
        'permission_callback' => '__return_true',
        'args'                => array(
            'name'         => array( 'required' => true, 'sanitize_callback' => 'sanitize_text_field' ),
            'email'        => array( 'required' => true, 'sanitize_callback' => 'sanitize_email' ),
            'phone'        => array( 'sanitize_callback' => 'sanitize_text_field' ),
            'subject'      => array( 'sanitize_callback' => 'sanitize_text_field' ),
            'message'      => array( 'required' => true, 'sanitize_callback' => 'sanitize_textarea_field' ),
            'inquiry_type' => array( 'sanitize_callback' => 'sanitize_text_field' ),
        ),
    ) );
} );

function tw_handle_inquiry( WP_REST_Request $request ): WP_REST_Response {
    $name    = $request->get_param( 'name' );
    $email   = $request->get_param( 'email' );
    $phone   = $request->get_param( 'phone' ) ?: 'N/A';
    $subject = $request->get_param( 'subject' ) ?: 'Contact Form Inquiry';
    $message = $request->get_param( 'message' );

    $to      = get_option( 'admin_email' );
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        "Reply-To: {$name} <{$email}>",
    );

    $body = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Phone:</strong> {$phone}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Message:</strong><br>{$message}</p>
    ";

    wp_mail( $to, "New Inquiry: {$subject}", $body, $headers );

    return new WP_REST_Response( array( 'success' => true ), 200 );
}
