class Step
{
    constructor(avenue, step)
    {
        this.avenue = avenue;
        this.title = '';
        this.content = $('<div>');
        this.options = $('<div class="btn-group" role="group" aria-label="options">');

        if (step.title) this.setTitle(step.title);
        if (step.content) this.setContent(step.content, this.content);
        if (step.steps) this.setOptions(step.steps);
    }

    setTitle(title)
    {
        this.title = title;
    }

    getTitle()
    {
        return this.title;
    }

    setContent(content, appendTo)
    {
        switch (typeof content)
        {
            case 'string':
                this.appendContentText(content, appendTo);
                break;
            case 'object':
                if (Array.isArray(content))
                {
                    this.appendContentArray(content, appendTo);
                    break;
                }
                this.appendContentObject(content, appendTo);
                break;
        }
    }

    setOptions(options)
    {
        for (let option of options)
        {
            let buttonTitle = '';
            if (option.title) buttonTitle = option.title;
            if (option.button) buttonTitle = option.button;

            this.options.append(
                $('<a href="' + this.avenue.getStepPath(option) + '" class="btn btn-outline-dark">').text(buttonTitle)
            );

        }
    }

    appendContentArray(content, appendTo)
    {
        for (let item of content)
        {
            this.setContent(item, appendTo);
        }
    }

    appendContentText(content, appendTo)
    {
        const ticks = /`([^`]*)`/gi;
        content = content.replace(ticks, '<code>$1</code>');

        appendTo.append(
            $('<p>').append(content)
        );
    }

    appendContentObject(content, appendTo)
    {
        switch (content.type)
        {
            case 'code':
                this.appendContentCode(content.content, appendTo);
                break;
            case 'button':
                this.appendContentButton(content.text, content.target, appendTo);
                break;
            case 'box':
                this.appendContentBox(content.content, appendTo);
                break;
            default:
                this.appendContentType(content.content, content.type, appendTo);
                break;
        }
    }

    appendContentCode(content, appendTo)
    {
        if (typeof content === 'object') {
            content = JSON.stringify(content, null, 4);
        }

        appendTo.append(
            $('<div class="card bg-dark text-left m-2">').append(
                $('<div class="card-body">').append(
                    $('<pre class="m-0">').append(
                        $('<code class="text-white">').text(content)
                    )
                )
            )
        );
    }

    appendContentButton(text, target, appendTo)
    {
        appendTo.append(
            $('<a href="' + target + '" class="btn btn-outline-dark">').text(text)
        );
    }

    appendContentBox(content, appendTo)
    {
        var box = $('<div class="card-body">');
        this.setContent(content, box);
        appendTo.append(
            $('<div class="card m-2">').append(box)
        );
    }

    appendContentType(content, type, appendTo)
    {
        appendTo.append(
            $('<' + type + '>').append(content)
        );
    }
}
