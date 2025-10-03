import yaml
import sys
import os

def validate_yaml_files(directory):
    """Validate all YAML files in a directory"""
    errors = []
    valid_count = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.yaml', '.yml')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r') as f:
                        documents = list(yaml.safe_load_all(f))
                        if not documents:
                            raise yaml.YAMLError("Empty YAML file")
                    print(f"✓ Valid YAML: {file_path} ({len(documents)} document(s))")
                    valid_count += 1
                except yaml.YAMLError as e:
                    error_msg = f"✗ Invalid YAML: {file_path} - {str(e)}"
                    print(error_msg)
                    errors.append(error_msg)
                except Exception as e:
                    error_msg = f"✗ Error reading: {file_path} - {str(e)}"
                    print(error_msg)
                    errors.append(error_msg)
    
    print(f"\nSummary: {valid_count} valid files, {len(errors)} errors")
    return len(errors) == 0

if __name__ == "__main__":
    directory = sys.argv[1] if len(sys.argv) > 1 else "."
    success = validate_yaml_files(directory)
    sys.exit(0 if success else 1)
