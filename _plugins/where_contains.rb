module Jekyll
  module WhereContainsFilter

    def where_contains(input, property, value)
      return input unless input.is_a?(Enumerable)
      input = input.values if input.is_a?(Hash)
      input.select { |object| item_property(object, property).to_s == value.to_s or item_property(object, property).include? value.to_s }
    end

  end
end

Liquid::Template.register_filter(Jekyll::WhereContainsFilter)