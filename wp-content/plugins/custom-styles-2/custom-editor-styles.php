<?php
/*
Plugin Name: Custom Editor Styles
Description: Make a custom styles dropdown menu for the visual editor in WordPress.
Author: Planet IA
Version: 1.1
*/
class Custom_Editor_Styles {

	/**
	 * Server path to the plugin folder
	 *
	 * @var string
	 */
	public $plugin_dir;

	/**
	 * URL to the plugin folder
	 *
	 * @var string
	 */
	public $plugin_url;

	/**
	 * Constructor
	 */
	public function __construct() {
		$this->plugin_dir = dirname( __FILE__ );
		$this->plugin_url = plugins_url( basename( dirname( __FILE__ ) ) );

		add_filter( 'tiny_mce_before_init', array( $this, 'tiny_mce_before_init' ) );
		add_filter( 'mce_buttons_2', array( $this, 'mce_buttons_2' ) );
		add_action( 'admin_init', array( $this, 'add_editor_style' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_custom_styles' ) );
	}

	/**
	 * Define custom styles for the dropdown menu
	 *
	 * @param array $settings Existing custom styles in TinyMCE
	 * @return array
	 */
	public function tiny_mce_before_init( $settings ) {
		$style_formats = array(
			/*array(
				'title'    => 'Smaller List Item',
				'selector' => 'blockquote',
				'classes'  => 'intro'
			),*/
			array(
				'title'  => 'Introduction',
				'inline' => 'span',
				'classes'  => 'intro'
				/*'styles' => array(
					'color'      => '#24303b',
					'font-size' => '24px' ,
					'line-height' => '120%',
					'margin-bottom' => '30px'
				)*/
			),
		);

		$settings['style_formats'] = json_encode( $style_formats );

		return $settings;
	}

	/**
	 * Add the Styles dropdown to the visual editor
	 *
	 * @param array $buttons Array of buttons already registered
	 * @return array
	 */
	public function mce_buttons_2( $buttons ) {
		array_unshift( $buttons, 'styleselect' );
		return $buttons;
	}

	/**
	 * Load a custom stylesheet in the visual editor
	 *
	 * The path in the add_editor_style function is relative to the theme root.
	 *
	 * @return void
	 */
	public function add_editor_style() {
		add_editor_style( '../../plugins/' . basename( dirname( __FILE__ ) ) . '/editor-style.css' );
	}

	/**
	 * Load a custom stylesheet on the website
	 *
	 * @return void
	 */
	public function enqueue_custom_styles() {
		wp_enqueue_style(
			'custom-editor-styles',
			$this->plugin_url . '/editor-style.css',
			array(),
			'1.1',
			'all'
		);
	}

}
$Custom_Editor_Styles = new Custom_Editor_Styles();