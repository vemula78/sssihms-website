<?php
/**
 * Add "Achievements" to the Cardiac Surgery dropdown, matching where Neurosurgery and
 * Anaesthesiology carry theirs: after the academic programmes, before Statistics.
 * Idempotent — does nothing if the item is already there.
 */
$menu = wp_get_nav_menu_object( 'Primary Menu — Mock' );
if ( ! $menu ) { WP_CLI::error( 'menu not found' ); }
$items = wp_get_nav_menu_items( $menu->term_id );

$parent = 0;
foreach ( $items as $i ) {
	if ( (int) $i->object_id === 85 ) { $parent = $i->db_id; break; }  // nested under Departments, not top level
}
if ( ! $parent ) { WP_CLI::error( 'Cardiac Surgery menu item not found' ); }

foreach ( $items as $i ) {
	if ( (int) $i->menu_item_parent === $parent && (int) $i->object_id === 590 ) {
		WP_CLI::log( 'already present (#' . $i->db_id . ')' ); return;
	}
}

// Statistics sits last; make room immediately before it.
$stats_order = null;
foreach ( $items as $i ) {
	if ( (int) $i->menu_item_parent === $parent && (int) $i->object_id === 54959 ) {
		$stats_order = (int) $i->menu_order;
		wp_update_post( array( 'ID' => $i->db_id, 'menu_order' => $stats_order + 1 ) );
	}
}
if ( null === $stats_order ) { WP_CLI::error( 'Statistics item not found under Cardiac Surgery' ); }

$id = wp_update_nav_menu_item( $menu->term_id, 0, array(
	'menu-item-title'     => 'Achievements',
	'menu-item-object'    => 'page',
	'menu-item-object-id' => 590,
	'menu-item-type'      => 'post_type',
	'menu-item-status'    => 'publish',
	'menu-item-parent-id' => $parent,
) );
if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
wp_update_post( array( 'ID' => $id, 'menu_order' => $stats_order ) );
WP_CLI::success( 'added Achievements (#' . $id . ') under Cardiac Surgery #' . $parent );

foreach ( (array) glob( WP_CONTENT_DIR . '/et-cache/*/*/*/*.css' ) as $f ) { @unlink( $f ); }
