<?php
/**
 * The Combined Hospital dashboard is the eleventh department dashboard and had no live
 * page until now, so it was never in the Statistics submenu. Add it as the first child,
 * ahead of the ten single-department pages. Idempotent.
 */
$menu = wp_get_nav_menu_object( 'Primary Menu — Mock' );
if ( ! $menu ) { WP_CLI::error( 'menu not found' ); }
$items = wp_get_nav_menu_items( $menu->term_id );

$parent = 0;
foreach ( $items as $i ) {
	if ( 'Statistics' === $i->title && $i->menu_item_parent ) { $parent = $i->db_id; break; }
}
if ( ! $parent ) {
	foreach ( $items as $i ) { if ( 'Statistics' === $i->title ) { $parent = $i->db_id; break; } }
}
if ( ! $parent ) { WP_CLI::error( 'no Statistics menu item' ); }

foreach ( $items as $i ) {
	if ( (int) $i->menu_item_parent === (int) $parent && (int) $i->object_id === 55368 ) {
		WP_CLI::log( 'already present under Statistics (#' . $i->db_id . ')' );
		return;
	}
}

// Push the ten existing children down one place so Combined leads the list.
foreach ( $items as $i ) {
	if ( (int) $i->menu_item_parent === (int) $parent ) {
		wp_update_post( array( 'ID' => $i->db_id, 'menu_order' => (int) $i->menu_order + 1 ) );
	}
}

$id = wp_update_nav_menu_item( $menu->term_id, 0, array(
	'menu-item-title'     => 'Combined Hospital',
	'menu-item-object'    => 'page',
	'menu-item-object-id' => 55368,
	'menu-item-type'      => 'post_type',
	'menu-item-status'    => 'publish',
	'menu-item-parent-id' => $parent,
) );
if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
wp_update_post( array( 'ID' => $id, 'menu_order' => 1 ) );
WP_CLI::log( 'added "Combined Hospital" (#' . $id . ') under Statistics #' . $parent );

$n = 0;
foreach ( (array) glob( WP_CONTENT_DIR . '/et-cache/*/*/*/*.css' ) as $f ) { @unlink( $f ); $n++; }
WP_CLI::log( 'cleared ' . $n . ' cached css files' );
