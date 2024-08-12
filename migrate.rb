require 'fileutils'
require 'yaml'
require 'csv'
require 'uri'
require 'pry'
require 'pry-byebug'

# Define input and output directories
input_dir = 'jekyll-code/blog/_posts/'
output_dir = 'hugo-code/content/posts/'

# Create output directory if it doesn't exist
FileUtils.mkdir_p(output_dir)

# Initialize CSV for links to download
csv_file = File.join(output_dir, 'to-download.csv')
CSV.open(csv_file, 'w', headers: ['url', 'path'], write_headers: true) do |csv|
  # Iterate through each markdown file in the input directory
  Dir.glob(File.join(input_dir, '*.md')).each do |file_path|
    # Extract the date and post name from the file name
    file_name = File.basename(file_path, '.md')
    date, post_name = file_name.split('-', 4)[0..2].join('-'), file_name.split('-', 4)[3]

    if post_name == "yearinreview"
      post_name = post_name + "-" + date[2..3]
    end

    # Create new post directory
    post_dir = File.join(output_dir, post_name)
    FileUtils.mkdir_p(post_dir)

    # Read and parse the markdown file
    content = File.read(file_path)
    front_matter, body = content.split('---', 3)[1..2]
    front_matter = YAML.load(front_matter)

    # Add the date to the front matter
    front_matter['date'] = date
    if post_name == "yearinreview"
      front_matter['slug'] = "yearinreview"
    end

    # Handle the teaser image
    teaser_path = front_matter['header']['teaser']
    teaser_filename = File.basename(teaser_path)
    teaser_new_path = File.join(post_dir, 'featured' + File.extname(teaser_filename))
    FileUtils.cp(teaser_path, teaser_new_path)

    # Recursively copy all images from the teaser directory to the new post directory
    teaser_dir = File.dirname(teaser_path)
    if teaser_dir != "img/blog"
      Dir.glob(File.join(teaser_dir, '**', '*')).each do |image|
        next if File.directory?(image)

        relative_path = image.sub(teaser_dir, '')
        new_path = File.join(post_dir, relative_path)
        puts "copying #{image} to #{new_path}"
        FileUtils.mkdir_p(File.dirname(new_path))
        FileUtils.cp(image, new_path)
      end
    end

    # Handle imgcredit and add URL to CSV if it contains a hyperlink
    imgcredit = front_matter['header']['imgcredit']
    url = URI.extract(imgcredit, ['http', 'https']).first
    if url
      csv << [url, post_dir]
    end

    # Write the updated front matter and body to the new markdown file
    new_content = [front_matter.to_yaml.strip, '---', body].join("\n")
    File.write(File.join(post_dir, 'index.md'), new_content)
  end
end