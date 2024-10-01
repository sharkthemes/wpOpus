import { __ } from "@wordpress/i18n";
import { registerBlockVariation } from "@wordpress/blocks";

const NAMESPACE = "wpopus/advanced-query";

registerBlockVariation("core/query", {
	name: NAMESPACE,
	title: __("Advanced Query", "wpopus"),
	description: __("Advanced layout", "wpopus"),
	category: "wpopus",
	isActive: ({ namespace }) => {
		return namespace === NAMESPACE;
	},
	// icon: "schedule",
	attributes: {
		namespace: NAMESPACE,
        className: "wpopus-advanced-query",
        query: {
            perPage: 3,
            pages: 0,
            offset: 0,
            postType: 'post',
            order: 'desc',
            orderBy: 'date',
            author: '',
            search: '',
            exclude: [],
            sticky: '',
            inherit: false,
        },
	},
	scope: ["inserter"],
	innerBlocks: [
		[
            "core/post-template", 
            {},
            [
                [
                    "core/group",
                    {
                        dimensions: {
                            minHeight: "400px"
                        }
                    },
                    [
                        [
                            "core/post-featured-image",
                            {
                                height: "100%",
                                style: {
                                    border: {
                                        radius: "0px"
                                    }
                                }
                            }
                        ]
                    ]
                ],
                [
                    "core/group",
                    {
                        className: "wpopus-advanced-query-details",
                        style: {
                            spacing: {
                                padding: {
                                    top: "25px",
                                    bottom: "25px",
                                }
                            }
                        }
                    },
                    [
                        [
                            "core/group",
                            {
                                className: "wpopus-advanced-query-meta",
                                layout: {
                                    type: "flex",
                                    verticalAlignment: "stretch"
                                },
                                style: {
                                    spacing: {
                                        blockGap: "10px"
                                    }
                                }
                            },
                            [
                                [
                                    "wpopus/icon-picker",
                                    {
                                        iconValue: "\u003csvg xmlns=\u0022http://www.w3.org/2000/svg\u0022 viewBox=\u00220 0 512 512\u0022\u003e\u003crect fill=\u0022none\u0022 stroke=\u0022#000\u0022 stroke-linejoin=\u0022round\u0022 stroke-width=\u002232\u0022 x=\u002248\u0022 y=\u002280\u0022 width=\u0022416\u0022 height=\u0022384\u0022 rx=\u002248\u0022/\u003e\u003ccircle cx=\u0022296\u0022 cy=\u0022232\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022376\u0022 cy=\u0022232\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022296\u0022 cy=\u0022312\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022376\u0022 cy=\u0022312\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022136\u0022 cy=\u0022312\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022216\u0022 cy=\u0022312\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022136\u0022 cy=\u0022392\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022216\u0022 cy=\u0022392\u0022 r=\u002224\u0022/\u003e\u003ccircle cx=\u0022296\u0022 cy=\u0022392\u0022 r=\u002224\u0022/\u003e\u003cline fill=\u0022none\u0022 stroke=\u0022#000\u0022 stroke-linejoin=\u0022round\u0022 stroke-width=\u002232\u0022 stroke-linecap=\u0022round\u0022 x1=\u0022128\u0022 y1=\u002248\u0022 x2=\u0022128\u0022 y2=\u002280\u0022/\u003e\u003cline fill=\u0022none\u0022 stroke=\u0022#000\u0022 stroke-linejoin=\u0022round\u0022 stroke-width=\u002232\u0022 stroke-linecap=\u0022round\u0022 x1=\u0022384\u0022 y1=\u002248\u0022 x2=\u0022384\u0022 y2=\u002280\u0022/\u003e\u003cline fill=\u0022none\u0022 stroke=\u0022#000\u0022 stroke-linejoin=\u0022round\u0022 stroke-width=\u002232\u0022 x1=\u0022464\u0022 y1=\u0022160\u0022 x2=\u002248\u0022 y2=\u0022160\u0022/\u003e\u003c/svg\u003e",
                                        options: {
                                            iconSize: 22
                                        }
                                    }
                                ],
                                [
                                    "core/post-date",
                                    {
                                        format: "M j, Y",
                                        style: {
                                            typography: {
                                                fontSize: '16px',
                                            }
                                        } 
                                    }
                                ],
                                [
                                    "wpopus/icon-picker",
                                    {
                                        iconValue: "\u003csvg xmlns=\u0022http://www.w3.org/2000/svg\u0022 width=\u0022512\u0022 height=\u0022512\u0022 viewBox=\u00220 0 512 512\u0022\u003e\u003cpath d=\u0022M64,192V120a40,40,0,0,1,40-40h75.89a40,40,0,0,1,22.19,6.72l27.84,18.56A40,40,0,0,0,252.11,112H408a40,40,0,0,1,40,40v40\u0022 style=\u0022fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\u0022/\u003e\u003cpath d=\u0022M479.9,226.55,463.68,392a40,40,0,0,1-39.93,40H88.25a40,40,0,0,1-39.93-40L32.1,226.55A32,32,0,0,1,64,192h384.1A32,32,0,0,1,479.9,226.55Z\u0022 style=\u0022fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\u0022/\u003e\u003c/svg\u003e",
                                        options: {
                                            iconSize: 22
                                        },
                                        style: {
                                            spacing: {
                                                margin: {
                                                    left: "10px"
                                                }
                                            }
                                        }
                                    }
                                ],
                                [
                                    "core/post-terms",
                                    {
                                        term: "category",
                                        style: {
                                            typography: {
                                                fontSize: '16px',
                                            }
                                        }  
                                    },
                                ],
                                [
                                    "wpopus/icon-picker",
                                    {
                                        iconValue: "\u003csvg xmlns=\u0022http://www.w3.org/2000/svg\u0022 width=\u0022512\u0022 height=\u0022512\u0022 viewBox=\u00220 0 512 512\u0022\u003e\u003cpath d=\u0022M344,144c-3.92,52.87-44,96-88,96s-84.15-43.12-88-96c-4-55,35-96,88-96S348,90,344,144Z\u0022 style=\u0022fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\u0022/\u003e\u003cpath d=\u0022M256,304c-87,0-175.3,48-191.64,138.6C62.39,453.52,68.57,464,80,464H432c11.44,0,17.62-10.48,15.65-21.4C431.3,352,343,304,256,304Z\u0022 style=\u0022fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:32px\u0022/\u003e\u003c/svg\u003e",
                                        options: {
                                            iconSize: 20
                                        },
                                        style: {
                                            spacing: {
                                                margin: {
                                                    left: "10px"
                                                }
                                            }
                                        }
                                    }
                                ],
                                [
                                    "core/post-author-name",
                                    {
                                        style: {
                                            typography: {
                                                fontSize: '16px',
                                                textTransform: "capitalize"
                                            }
                                        } 
                                    }
                                ]
                            ]
                        ],
                        
                        [
                            "core/post-title",
                            {
                                isLink: true,
                                style: {
                                    typography: {
                                        fontSize: '32px',
                                    },
                                    spacing: {
                                        margin: {
                                            top: '15px',
                                            bottom: '15px'
                                        }
                                    }
                                }  
                            }
                        ],
                        [
                            "core/post-excerpt",
                            {
                                moreText: __( "Read More...", "wpopus" ),
                                excerptLength: 20,
                                style: {
                                    typography: {
                                        fontSize: '18px',
                                    }
                                } 
                            }
                        ]
                    ]
                ]
            ]
		],
		["core/query-pagination"],
		["core/query-no-results"],
	],
} );


