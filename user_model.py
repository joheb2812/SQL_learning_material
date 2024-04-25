from utilities.database import Database
from flask_restful import abort
import MySQLdb
from .user import User
from .transactions import Transactios


class UserModel:
    def __init__(self):
        self.db = Database()

    def get_user_data(self, user_id):
        conn = self.db.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Users WHERE userId=%s", (user_id,))
            user_data = cursor.fetchone()
            if not user_data:
                cursor.close()
                abort(404, message="User not found")
            cursor.execute("SELECT * FROM Transactions WHERE userId=%s ORDER BY transactionDate DESC LIMIT 5",
                           (user_data[0],))
            transaction_data = cursor.fetchall()
            transactions = []
            for data in transaction_data:
                transaction = Transactios(data[0],
                                          data[1].strftime("%Y-%m-%d"),
                                          float(data[2]),
                                          data[3]
                                          )
                transactions.append(transaction.__dict__)
                # transactions.append({
                #     "transactionId": data[0],
                #     "transactionDate": data[1].strftime("%Y-%m-%d"),
                #     "amount": float(data[2]),
                #     "debitOrCredit": data[3]
                # })
            user = User(user_data[0], user_data[1], user_data[2])
            return (
                {"User": user.__dict__,
                 "transactions": transactions})
            # (
            #     {
            #     "user": {
            #         "userId": user_data[0],
            #         "firstName": user_data[1],
            #         "lastName": user_data[2]
            #     },
            #     "transactions": transactions
            # }, 200)

        except MySQLdb.Error as e:
            print(f"An error occurred: {e}")
            abort(500, message="Internal server error")
        finally:
            with conn.cursor() as cursor:
                cursor.close()
            conn.close()

    def get_all_users(self):
        conn = self.db.get_connection()
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM Users")
            users_data = cursor.fetchall()
            users = []
            # five_transactions = cursor.execute("SELECT * FROM Transactions WHERE userId=%s ORDER BY transactionDate DESC LIMIT 5")
            for row in users_data:
                cursor.execute("SELECT * FROM Transactions WHERE userId=%s ORDER BY transactionDate DESC LIMIT 5",
                               (row[0],))
                transaction_data = cursor.fetchall()
                transactions = []
                for data in transaction_data:
                    transaction = Transactios(data[0],
                                              data[1].strftime("%Y-%m-%d"),
                                              float(data[2]),
                                              data[3])
                    transactions.append(transaction.__dict__)
                    # transactions.append({
                    #     "transactionId": data[0],
                    #     "transactionDate": data[1].strftime("%Y-%m-%d"),
                    #     "amount": float(data[2]),
                    #     "debitOrCredit": data[3]
                    # })
                user_data = User(row[0], row[1], row[2])
                users.append({
                    "user": user_data.__dict__,

                    #     {
                    #     "userId": user[0],
                    #     "firstName": user[1],
                    #     "lastName": user[2]
                    # },
                    "transactions": transactions
                })
            return users

        except MySQLdb.Error as e:
            print(f"An error occurred: {e}")
            abort(500, message="Internal server error")
        finally:
            with conn.cursor() as cursor:
                cursor.close()
            conn.close()

    def get_all_users_data(self, user_id):
        conn = self.db.get_connection()
        try:
            cursor = conn.cursor()
            # Fetching user data
            cursor.execute("SELECT * FROM Users WHERE userId=%s", (user_id,))
            user_data = cursor.fetchone()
            if not user_data:
                cursor.close()
                abort(404, message="User not found")

            # Fetch transaction data for the user
            cursor.execute("""
                SELECT * FROM Transactions 
                WHERE userId=%s 
                ORDER BY transactionDate DESC 
                LIMIT 5
            """, (user_data[0],))
            transaction_data = cursor.fetchall()

            # Process transaction data
            transactions = [{
                "transactionId": data[0],
                "transactionDate": data[1].strftime("%Y-%m-%d"),
                "amount": float(data[2]),
                "debitOrCredit": data[3]
            } for data in transaction_data]

            # Create user object
            user = User(user_data[0], user_data[1], user_data[2])

            return {
                "User": user.__dict__,
                "transactions": transactions
            }, 200

        except MySQLdb.Error as e:
            print(f"An error occurred: {e}")
            abort(500, message="Internal server error")
        finally:
            with conn.cursor() as cursor:
                cursor.close()
            conn.close()

