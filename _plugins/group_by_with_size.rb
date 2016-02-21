module Jekyll
  module GroupByWithSizeFilter

    def group_by_with_size(input, property)
      if groupable?(input)
        input.group_by do |item|
          item_property(item, property).to_s
        end.inject([]) do |memo, i|
          memo << { "name" => i.first, "items" => i.last, "size" => i.last.size }
        end
      else
        input
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::GroupByWithSizeFilter)