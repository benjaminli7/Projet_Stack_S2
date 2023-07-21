
// Import the required modules
const {
    createFriend,
    getAllFriendsByUser,
    acceptFriendRequest,
    deleteFriend,
} = require("../../controllers/friend");

// Import the models for mocking
const { User, Friend } = require("../../db");

// Mock the database models
jest.mock("../../db", () => ({
  User: {
    findOne: jest.fn(),
  },
  Friend: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

// Description des tests pour le contrôleur "Friend"
describe("Friend Controller Tests", () => {
  
    // Test de l'endpoint "createFriend"
    describe("POST /api/friends", () => {
      // Réinitialiser les appels aux fonctions "mock" après chaque test
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      // Test : Ajouter un nouvel ami avec succès
      it("should return a 200 status and a success message when adding a new friend", async () => {
        // Requête simulée avec des données de test
        const req = {
          body: {
            username: "user1",
            friendUsername: "user2", 
          },
        };
        // Réponse simulée avec des fonctions "mock"
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Simuler les réponses de la base de données
        User.findOne.mockResolvedValue({ id: 1 }); // Supposons que l'utilisateur existe avec l'ID 1
        User.findOne.mockResolvedValue({ id: 2 }); // Supposons que l'ami existe avec l'ID 2
        Friend.findOne.mockResolvedValue(null); // Supposons qu'il n'y a pas de relation d'ami existante
  
        await createFriend(req, res);
  
        // Vérifier les appels aux fonctions attendus
        expect(User.findOne).toHaveBeenCalledTimes(2); // Deux appels pour trouver les utilisateurs
        expect(Friend.findOne).toHaveBeenCalledTimes(1); // Un appel pour vérifier l'existence d'une relation d'ami
        expect(Friend.create).toHaveBeenCalledTimes(1); // Un appel pour créer une nouvelle relation d'ami
        expect(res.status).toHaveBeenCalledWith(200); // Vérifier le statut de réponse
        expect(res.json).toHaveBeenCalledWith({ message: "Friend request sent" }); // Vérifier la réponse JSON
      });
  
      // Test : Erreur lors d'une tentative d'ajout de soi-même comme ami
      it("should return a 400 status and an error message when trying to add yourself as a friend", async () => {
        const req = {
          body: {
            username: "user1", 
            friendUsername: "user1", 
          },
        };
        // Réponse simulée avec des fonctions "mock"
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        await createFriend(req, res);
  
        // Vérifier qu'aucune fonction n'a été appelée pour trouver des utilisateurs ou créer une relation d'ami
        expect(User.findOne).not.toHaveBeenCalled();
        expect(Friend.findOne).not.toHaveBeenCalled();
        expect(Friend.create).not.toHaveBeenCalled();
  
        // Vérifier le statut de réponse et le message d'erreur JSON
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          message: "You can't add yourself as a friend",
        });
      });
  
      // Test : Erreur lorsque la demande d'ami est déjà en attente ou acceptée entre les utilisateurs
      it("should return a 400 here is already a pending or accepted friend request between the users", async () => {
        // Requête simulée avec des données de test
        const req = {
          body: {
            username: "user1", // Remplacer par des données de test si nécessaire
            friendUsername: "user2", // Remplacer par des données de test si nécessaire
          }
        };
        // Réponse simulée avec des fonctions "mock"
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
  
        // Simuler les réponses de la base de données, en supposant qu'il existe déjà une relation d'ami
        User.findOne.mockResolvedValue({ id: 1 }); // Supposons que l'utilisateur existe avec l'ID 1
        User.findOne.mockResolvedValue({ id: 2 }); // Supposons que l'ami existe avec l'ID 2
        Friend.findOne.mockResolvedValue({ id: 1 }); // Supposons qu'il existe déjà une relation d'ami
  
        await createFriend(req, res);
  
        // Vérifier les appels aux fonctions attendus
        expect(User.findOne).toHaveBeenCalledTimes(2); // Deux appels pour trouver les utilisateurs   
        expect(Friend.findOne).toHaveBeenCalledTimes(1); // Un appel pour vérifier l'existence d'une relation d'ami
        expect(Friend.create).not.toHaveBeenCalled(); // Aucun appel pour créer une nouvelle relation d'ami
        expect(res.status).toHaveBeenCalledWith(400); // Vérifier le statut de réponse
        expect(res.json).toHaveBeenCalledWith({
          message: "There is already a pending or accepted friend request between the users",
        }); // Vérifier le message d'erreur JSON
      });
  
    });
  
    // Test de l'endpoint "GET /api/friends"
    describe("GET /api/friends", () => {
      // Réinitialiser les appels aux fonctions "mock" après chaque test
      afterEach(() => {
        jest.clearAllMocks();
      });
  
      // Test : Renvoyer une liste d'amis pour un utilisateur valide
      it("should return a list of friends for a valid user", async () => {
        // Requête simulée avec des données de test
        const req = {
          query: {
            username: "user1", // Remplacer par des données de test si nécessaire
          },
        };
        // Réponse simulée avec des fonctions "mock"
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Simuler la réponse de la base de données
        User.findOne.mockResolvedValue({ id: 1 }); // Supposons que l'utilisateur existe avec l'ID 1
        Friend.findAll.mockResolvedValue([
          // Simuler la liste d'amis pour l'utilisateur
          {
            status: "accepted",
            actionUserId: 2,
            user: {
              id: 1,
              username: "user1",
              email: "user1@example.com",
            },
            friend: {
              id: 2,
              username: "user2",
              email: "user2@example.com",
            },
          },
        ]);
  
        await getAllFriendsByUser(req, res);
  
        // Vérifier les appels aux fonctions attendus
        expect(User.findOne).toHaveBeenCalledTimes(1); // Un appel pour trouver l'utilisateur
        expect(Friend.findAll).toHaveBeenCalledTimes(1); // Un appel pour trouver les amis de l'utilisateur
        expect(res.status).toHaveBeenCalledWith(200); // Vérifier le statut de réponse
        expect(res.json).toHaveBeenCalledWith([
          {
            status: "accepted",
            actionUserId: 2,
            user: {
              id: 2,
              username: "user2",
              email: "user2@example.com",
            },
          },
        ]); // Vérifier la réponse JSON
      });
  
      // Test : Renvoyer un statut 404 et un message d'erreur pour un utilisateur inexistant
      it("should return a 404 status and an error message for a non-existent user", async () => {
        // Requête simulée avec un utilisateur inexistant
        const req = {
          query: {
            username: "nonexistentuser", 
          },
        };
        // Réponse simulée avec des fonctions "mock"
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        User.findOne.mockResolvedValue(null); // Utilisateur non trouvé
  
        await getAllFriendsByUser(req, res);
  
        // Vérifier les appels aux fonctions attendus
        expect(User.findOne).toHaveBeenCalledTimes(1); // Un appel pour trouver l'utilisateur
        expect(Friend.findAll).toHaveBeenCalledTimes(0); // Aucun appel pour trouver les amis de l'utilisateur
        expect(res.status).toHaveBeenCalledWith(404); // Vérifier le statut de réponse
        expect(res.json).toHaveBeenCalledWith({ error: "User not found" }); // Vérifier le message d'erreur JSON
      });
    });
    // Test de l'endpoint "PUT /api/friends"
    describe("acceptFriendRequest function", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        
        it("should accept a friend request and return a success message", async () => {
          const req = {
            body: {
              username: "user1", // Remplacer par des données de test si nécessaire
              friendUsername: "user2", // Remplacer par des données de test si nécessaire
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Mock les fonctions de base de données
          User.findOne.mockResolvedValueOnce({ id: 1 }); // Supposons que l'utilisateur existe avec l'ID 1
          User.findOne.mockResolvedValueOnce({ id: 2 }); // Supposons que l'ami existe avec l'ID 2
          Friend.findOne.mockResolvedValueOnce({ // Supposons qu'il existe une demande d'ami en attente
            id: 1,
            userId: 2,
            friendId: 1,
            status: "pending",
          });
          Friend.update.mockResolvedValue({ affectedRows: 1 }); // Supposons que la mise à jour s'est bien déroulée
      
          await acceptFriendRequest(req, res);

          Friend.findOne
      
          // Vérifier les appels aux fonctions attendus
          expect(User.findOne).toHaveBeenCalledTimes(2); // Deux appels pour trouver les utilisateurs
          expect(Friend.findOne).toHaveBeenCalledTimes(1); // Un appel pour vérifier l'existence d'une demande d'ami en attente
          expect(Friend.update).toHaveBeenCalledTimes(1); // Un appel pour mettre à jour la demande d'ami
          expect(res.status).toHaveBeenCalledWith(200); // Vérifier le statut de réponse
          expect(res.json).toHaveBeenCalledWith({ message: "Demande d'ami acceptée avec succès" }); // Vérifier la réponse JSON
        });
      
        it("should return a 404 status and an error message for a non-existent friend request", async () => {
          const req = {
            body: {
              username: "user1", // Remplacer par des données de test si nécessaire
              friendUsername: "user2", // Remplacer par des données de test si nécessaire
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Mock les fonctions de base de données pour simuler l'absence de demande d'ami en attente
          User.findOne.mockResolvedValueOnce({ id: 1 }); // Supposons que l'utilisateur existe avec l'ID 1
          User.findOne.mockResolvedValueOnce({ id: 2 }); // Supposons que l'ami existe avec l'ID 2
          Friend.findOne.mockResolvedValueOnce(null); // Supposons qu'il n'existe pas de demande d'ami en attente
      
          await acceptFriendRequest(req, res);
      
          // Vérifier les appels aux fonctions attendus
          expect(User.findOne).toHaveBeenCalledTimes(2); // Deux appels pour trouver les utilisateurs
          expect(Friend.findOne).toHaveBeenCalledTimes(1); // Un appel pour vérifier l'existence d'une demande d'ami en attente
          expect(Friend.update).not.toHaveBeenCalled(); // Aucun appel pour mettre à jour la demande d'ami
          expect(res.status).toHaveBeenCalledWith(404); // Vérifier le statut de réponse
          expect(res.json).toHaveBeenCalledWith({ error: "Demande d'ami introuvable" }); // Vérifier le message d'erreur JSON
        });
      
    });
    //Test de l'endpoint "DELETE /api/friends"
    describe("deleteFriend function", () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        
        it("should delete a friend relationship and return a success message", async () => {
          const req = {
            body: {
              username: "user1", // Replace with test data as needed
              friendUsername: "user2", // Replace with test data as needed
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Mock database responses
          User.findOne.mockResolvedValueOnce({ id: 1 }); // Assume the user exists with ID 1
          User.findOne.mockResolvedValueOnce({ id: 2 }); // Assume the friend exists with ID 2
          Friend.destroy.mockResolvedValue(1); // Assume one row is deleted successfully
      
          await deleteFriend(req, res);
      
          // Verify expected function calls
          expect(User.findOne).toHaveBeenCalledTimes(2); // Two calls to find users
          expect(Friend.destroy).toHaveBeenCalledTimes(1); // One call to delete friend relationship
          expect(res.status).toHaveBeenCalledWith(200); // Verify response status
          expect(res.json).toHaveBeenCalledWith({ message: "Ami supprimé avec succès" }); // Verify JSON response
        });
      
        it("should return a 404 status and an error message when friend relationship not found or already deleted", async () => {
          const req = {
            body: {
              username: "user1", // Replace with test data as needed
              friendUsername: "user2", // Replace with test data as needed
            },
          };
          const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
      
          // Mock database responses to simulate the absence of friend relationship
          User.findOne.mockResolvedValueOnce({ id: 1 }); // Assume the user exists with ID 1
          User.findOne.mockResolvedValueOnce({ id: 2 }); // Assume the friend exists with ID 2
          Friend.destroy.mockResolvedValue(0); // Assume no rows are deleted (friend relationship not found or already deleted)
      
          await deleteFriend(req, res);
      
          // Verify expected function calls
          expect(User.findOne).toHaveBeenCalledTimes(2); // Two calls to find users
          expect(Friend.destroy).toHaveBeenCalledTimes(1); // One call to delete friend relationship
          expect(res.status).toHaveBeenCalledWith(404); // Verify response status
          expect(res.json).toHaveBeenCalledWith({ error: "Ami introuvable ou déjà supprimé" }); // Verify JSON error response
        });
    });
});
  

    
