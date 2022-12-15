require 'fileutils'
include FileUtils
require 'csv'
require 'yaml'
require 'json'

# Adapted from https://github.com/mnyrop/pagemaster/

def slug(str)
  str.downcase.tr(' ', '-').gsub(/[^:\w-]/, '').gsub("--","-")
end

def create_from_datasets()
  #not all datasets are directly referenced in categories.yml
  #this creates any categories a dataset talks about
  categories = []
  datasets = Dir.entries("_datasets")
  Dir.glob("_datasets/*.md") {|dataset|
    data = YAML.load_file(dataset)
    if !data.key? "category"
      categories.push("Uncategorized")
      next
    end
    categories += data["category"] unless data["category"].is_a?(String)
    categories.push(data["category"]) unless data["category"].is_a?(Array)
  }
  config = YAML.load_file('_config.yml')
  perma =  '/'
  data_files = ["categories"]
  categories.tally.each do |item|
    name, count = item
    meta = {
      'id_key'  => "name",
      'layout'  => "category",
    }
    data = [{"name" => name}]
    generate_pages("categories", meta, data, perma, count)
  end
end

def generate_pages(name, meta, data, perma, count)
  completed = 0
  skipped = 0
  dir = '_' + name
  mkdir_p(dir)
  data.each do |item|
    pagename = slug(item.fetch(meta['id_key']))
    pagepath = dir + '/' + pagename + '.md'
    item['permalink'] = '/' + name + '/' + pagename + perma
    item['layout'] = meta['layout']
    item['datasetcount'] = count
    if File.exist?(pagepath)
      puts "#{pagename}.md already exits. Skipping."
      skipped += 1
    else
      File.open(pagepath, 'w') { |file| file.write(item.to_yaml.to_s + '---') }
      completed += 1
    end
  end
end

create_from_datasets