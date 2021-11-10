import axios from "axios";


/**
 * Helper class for working with our WordPress instance
 */
export default class WordPress {
	// AUTHENTICATION credentials for our WordPress site
	// config = {
	// 	auth: {
	// 	 	username: process.env.WP_USER,
	// 	 	password: process.env.WP_PASSWORD
	// 	}
	// };

	// baseURL = `https://${process.env.WP_DOMAIN}/wp-json`;

	serverToken = '';

	/**
	 * LOGIN using JWT
	 * 
	 * @link https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/#description
	 */
	static async authenticate(){
		const wordpress = this;

		await axios.post(`https://${process.env.WP_DOMAIN}/wp-json/jwt-auth/v1/token`, 
		{
			username: process.env.WP_USER,
			password: process.env.WP_PASSWORD
		}
		).then( function( response ) {
			wordpress.serverToken = response.data.token;
		} )
		.catch( function( error ) {
			console.error( 'Authentication Error: ', error);
		} );
	}

	/**
	 * POST a messages content to wordpress
	 * @param {Message} msg Discord Message
	 */
	static async postAnnouncement(msg) {
		const wordpress = this;

		if(msg.channel.id === process.env.ANNOUNCEMENTS_ID){
			try {
				await axios.post(`https://${process.env.WP_DOMAIN}/wp-json/wp/v2/posts`, 
					{
						title: 'Announcement: '+msg.author.username,
						content: msg.content,
						status: 'draft',
  					categories: [process.env.WP_CAT_ID],
						featured_media: process.env.WP_IMAGE_ID
					},
					{
						headers: { Authorization: `Bearer ${wordpress.serverToken}` }
					}
				);
			}catch(e) {
				console.error('WP postAnnouncement: ',e.message);
			}
		}
	}
}