# module Jekyll

#   class CategoryPage < Page
#     def initialize(site, base, dir, category)
#       @site = site
#       @base = base
#       @dir = dir
#       @name = 'index.html'

#       self.process(@name)
#       self.read_yaml(File.join(base, '_layouts'), 'category.html')
#       self.data['category'] = category
#       self.data['title'] = category
#     end
#   end

#   class CategoryPageGenerator < Generator
#     safe true

#     def generate(site)
#       if site.layouts.key? 'category'
#         dir = site.config['category_dir'] || 'categories'
#         docs = site.collections['datasets'].docs.find_all {|d| d.data.has_key?('category')}.group_by {|d| d.data['category']}
#         docs.each_key do |category|
#           site.pages << CategoryPage.new(site, site.source, File.join(dir, Utils.slugify(category)), category)
#         end
#       end
#     end
#   end

# end