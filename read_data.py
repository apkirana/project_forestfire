import os
import pandas as pd

def main():
    # Change directory to the location where the CSV file is stored
    directory_path = '/data'
    
    # Verify the directory and list its contents
    if os.path.exists(directory_path):
        print("Directory exists. Listing contents:")
        print(os.listdir(directory_path))
        
        # Specify the path to your CSV file
        file_path = os.path.join(directory_path, 'ooregon_fire.csv')
        
        # Check if the file exists
        if os.path.isfile(file_path):
            try:
                # Read the CSV file into a pandas DataFrame
                data = pd.read_csv(file_path)
                # Display the first few rows of the DataFrame
                print("CSV file loaded successfully. Here are the first few rows:")
                print(data.head())
            except pd.errors.EmptyDataError:
                print("The file is empty.")
            except pd.errors.ParserError:
                print("Error parsing the CSV file.")
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
        else:
            print(f"The file was not found at the specified path: {file_path}")
    else:
        print(f"The directory was not found: {directory_path}")

if __name__ == "__main__":
    main()