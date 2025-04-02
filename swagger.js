export const swaggerFile = {
  "openapi": "3.0.0",
  "info": {
    "title": "Social Media API",
    "version": "1.0.0",
    "description": "API documentation for the Social Media Backend"
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local server"
    }
  ],
  "components": {
    "securitySchemes": {
      "JWT": {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "scheme": "Bearer"
      }
    }
  },
  "security": [
    {
      "JWT": []
    }
  ],
  "paths": {
    "/api/users/signup": {
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "Register a new user",
        "description": "This endpoint registers a new user by taking the required details in the request body.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string",
                    "example": "michael_b"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "example": "michael.brown@example.com"
                  },
                  "password": {
                    "type": "string",
                    "format": "password",
                    "example": "12345"
                  },
                  "firstName": {
                    "type": "string",
                    "example": "Michael"
                  },
                  "lastName": {
                    "type": "string",
                    "example": "Brown"
                  }
                },
                "required": [
                  "username",
                  "email",
                  "password",
                  "firstName",
                  "lastName"
                ]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "User successfully created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User registered successfully."
                    },
                    "status": {
                      "type": "string",
                      "example": "CREATE"
                    },
                    "code": {
                      "type": "integer",
                      "example": 201
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "username": {
                          "type": "string",
                          "example": "michael_b"
                        },
                        "email": {
                          "type": "string",
                          "example": "michael.brown@example.com"
                        },
                        "firstName": {
                          "type": "string",
                          "example": "Michael"
                        },
                        "lastName": {
                          "type": "string",
                          "example": "Brown"
                        },
                        "profilePicture": {
                          "type": "string",
                          "nullable": true,
                          "example": null
                        },
                        "bio": {
                          "type": "string",
                          "nullable": true,
                          "example": null
                        },
                        "_id": {
                          "type": "string",
                          "example": "67eaf1ab28cbb95b09140835"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error - User creation failed",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 500
                    },
                    "error_type": {
                      "type": "string",
                      "example": "INTERNAL_ERROR"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "User not created due to some error we'll check and let you know"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/signin": {
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "User login",
        "description": "This endpoint allows users to log in using their credentials.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string",
                    "example": "johndoe123"
                  },
                  "email": {
                    "type": "string",
                    "format": "email",
                    "example": "john.doe@example.com"
                  },
                  "password": {
                    "type": "string",
                    "format": "password",
                    "example": "12345"
                  }
                },
                "required": [
                  "username",
                  "email",
                  "password"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User logged in successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User logged in successfully."
                    },
                    "status": {
                      "type": "string",
                      "example": "LOGIN"
                    },
                    "code": {
                      "type": "integer",
                      "example": 200
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "accessToken": {
                          "type": "string",
                          "example": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid credentials",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 400
                    },
                    "error_type": {
                      "type": "string",
                      "example": "INTERNAL_ERROR"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "User not found with the given credentials"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/get-details/{userId}": {
      "get": {
        "tags": [
          "Users"
        ],
        "summary": "Get user details",
        "description": "This endpoint fetches the details of a user by userId.",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "description": "The ID of the user to fetch details for.",
            "schema": {
              "type": "string",
              "example": "67e7186b3617ffe6d8da1cc2"
            }
          }
        ],
        "security": [
          {
            "JWT": []
          }
        ],
        "responses": {
          "200": {
            "description": "User fetched successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User fetched successfully"
                    },
                    "status": {
                      "type": "string",
                      "example": "READ"
                    },
                    "code": {
                      "type": "integer",
                      "example": 200
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "_id": {
                          "type": "string",
                          "example": "67e7186b3617ffe6d8da1cc2"
                        },
                        "username": {
                          "type": "string",
                          "example": "johndoe123"
                        },
                        "email": {
                          "type": "string",
                          "example": "john.doe@example.com"
                        },
                        "firstName": {
                          "type": "string",
                          "example": "John kumar"
                        },
                        "lastName": {
                          "type": "string",
                          "example": "Doe"
                        },
                        "profilePicture": {
                          "type": "string",
                          "example": "/1743367859511_passport.jpeg"
                        },
                        "bio": {
                          "type": "string",
                          "nullable": true,
                          "example": null
                        },
                        "createdAt": {
                          "type": "string",
                          "example": "2025-03-28T21:45:15.204Z"
                        },
                        "updatedAt": {
                          "type": "string",
                          "example": "2025-03-31T20:24:48.678Z"
                        },
                        "__v": {
                          "type": "integer",
                          "example": 0
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Invalid or missing JWT token",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 401
                    },
                    "error_type": {
                      "type": "string",
                      "example": "UNAUTHORIZED"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "Authorization token is required. Please log in."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/get-all-details": {
      "get": {
        "tags": [
          "Users"
        ],
        "summary": "Get all user details",
        "description": "This endpoint fetches details of all users.",
        "security": [
          {
            "JWT": []
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched all user details",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User fetched successfully"
                    },
                    "status": {
                      "type": "string",
                      "example": "READ"
                    },
                    "code": {
                      "type": "integer",
                      "example": 200
                    },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "_id": {
                            "type": "string",
                            "example": "67e9094e00e94e3abf295c12"
                          },
                          "username": {
                            "type": "string",
                            "example": "janesmith456"
                          },
                          "email": {
                            "type": "string",
                            "example": "jane.smith@example.com"
                          },
                          "firstName": {
                            "type": "string",
                            "example": "Jane"
                          },
                          "lastName": {
                            "type": "string",
                            "example": "Smith"
                          },
                          "profilePicture": {
                            "type": "string",
                            "example": "https://example.com/profiles/janesmith.jpg"
                          },
                          "bio": {
                            "type": "string",
                            "nullable": true,
                            "example": null
                          },
                          "createdAt": {
                            "type": "string",
                            "example": "2025-03-30T09:05:18.081Z"
                          },
                          "updatedAt": {
                            "type": "string",
                            "example": "2025-03-30T09:05:18.081Z"
                          },
                          "__v": {
                            "type": "integer",
                            "example": 0
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Invalid or missing JWT token",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 401
                    },
                    "error_type": {
                      "type": "string",
                      "example": "UNAUTHORIZED"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "Authorization token is required. Please log in."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/update-details/{userId}": {
      "put": {
        "tags": [
          "Users"
        ],
        "summary": "Update user details with profile picture",
        "description": "This endpoint allows users to update their password, first name, last name, profile picture , bio. Username and email cannot be updated.",
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "description": "The ID of the user to update",
            "schema": {
              "type": "string",
              "example": "67e7186b3617ffe6d8da1cc2"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "profile_picture": {
                    "type": "string",
                    "format": "binary",
                    "description": "Profile picture (max size 2MB)"
                  },
                  "password": {
                    "type": "string",
                    "example": "12345",
                    "description": "Password"
                  },
                  "firstName": {
                    "type": "string",
                    "example": "John kumar",
                    "description": "First name"
                  },
                  "lastName": {
                    "type": "string",
                    "example": "Doe",
                    "description": "Last name"
                  },
                  "bio": {
                    "type": "string",
                    "example": "This is a basic bios about the profile",
                    "description": "bio"
                  }
                },
                "required": []
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User details updated successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User details updated successfully"
                    },
                    "status": {
                      "type": "string",
                      "example": "UPDATE"
                    },
                    "code": {
                      "type": "integer",
                      "example": 200
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "_id": {
                          "type": "string",
                          "example": "67e7186b3617ffe6d8da1cc2"
                        },
                        "username": {
                          "type": "string",
                          "example": "johndoe123"
                        },
                        "email": {
                          "type": "string",
                          "example": "john.doe@example.com"
                        },
                        "firstName": {
                          "type": "string",
                          "example": "John kumar"
                        },
                        "lastName": {
                          "type": "string",
                          "example": "Doe"
                        },
                        "profilePicture": {
                          "type": "string",
                          "nullable": true,
                          "example": "/path/to/updated/profile_picture.jpg"
                        },
                        "bio": {
                          "type": "string",
                          "nullable": true,
                          "example": null
                        },
                        "createdAt": {
                          "type": "string",
                          "example": "2025-03-28T21:45:15.204Z"
                        },
                        "updatedAt": {
                          "type": "string",
                          "example": "2025-03-31T20:24:48.678Z"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid input",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 400
                    },
                    "error_type": {
                      "type": "string",
                      "example": "BAD_REQUEST"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "Invalid fields or file size exceeds 2MB"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Missing or invalid token",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 401
                    },
                    "error_type": {
                      "type": "string",
                      "example": "UNAUTHORIZED"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "Authorization token is required. Please log in."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 500
                    },
                    "error_type": {
                      "type": "string",
                      "example": "INTERNAL_ERROR"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "An error occurred while updating user details."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/logout": {
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "Logout a user",
        "description": "This endpoint invalidates the user's current token. The token will be stored in an array of invalid tokens, preventing further access to secure routes with the same token. The `user_id` is extracted from the JWT payload.",
        "security": [
          {
            "JWT": []
          }
        ],
        "responses": {
          "200": {
            "description": "User successfully logged out and token invalidated",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User logged out successfully."
                    },
                    "status": {
                      "type": "string",
                      "example": "LOGOUT"
                    },
                    "code": {
                      "type": "integer",
                      "example": 200
                    },
                    "data": {
                      "type": "object",
                      "properties": {
                        "acknowledged": {
                          "type": "boolean",
                          "example": true
                        },
                        "modifiedCount": {
                          "type": "integer",
                          "example": 1
                        },
                        "upsertedId": {
                          "type": "null",
                          "example": null
                        },
                        "upsertedCount": {
                          "type": "integer",
                          "example": 0
                        },
                        "matchedCount": {
                          "type": "integer",
                          "example": 1
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Invalid or missing token",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 400
                    },
                    "error_type": {
                      "type": "string",
                      "example": "BAD_REQUEST"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "Authorization token is required."
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - User not logged in or invalid token",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 401
                    },
                    "error_type": {
                      "type": "string",
                      "example": "UNAUTHORIZED"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "Authorization token is required to logout."
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "example": 500
                    },
                    "error_type": {
                      "type": "string",
                      "example": "INTERNAL_ERROR"
                    },
                    "validation_error": {
                      "type": "string",
                      "example": "An error occurred while processing the logout request."
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/users/logout-all-devices": {
      "post": {
        "tags": ["Users"],
        "summary": "Log out the user from all devices",
        "description": "This endpoint logs the user out from all devices by removing all valid tokens and adding them to the invalid tokens list.",
        "security": [
          {
            "JWT": []
          }
        ],
        "responses": {
          "200": {
            "description": "User logged out from all devices",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "User logged out successfully."
                    },
                    "status": {
                      "type": "string",
                      "example": "LOGOUT"
                    },
                    "code": {
                      "type": "integer",
                      "example": 200
                    },
                    "data": {
                      "type": "string",
                      "example": "User is logged out from all devices please login again later"
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized - Missing or invalid token",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "integer", "example": 401 },
                    "error_type": { "type": "string", "example": "AUTH_ERROR" },
                    "message": { "type": "string", "example": "Unauthorized - Invalid token" }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Internal server error - Failed to log out user",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": { "type": "integer", "example": 500 },
                    "error_type": { "type": "string", "example": "INTERNAL_ERROR" },
                    "validation_error": { "type": "string", "example": "Error logging out user from all devices" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}