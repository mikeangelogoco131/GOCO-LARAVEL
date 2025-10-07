<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ExtendStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('student_id')->nullable()->unique()->after('id');
            $table->unsignedInteger('student_sequence')->nullable()->after('student_id');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('suffix')->nullable()->after('last_name');
            $table->enum('gender', ['male','female','other'])->nullable()->after('email');
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete()->after('department_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropConstrainedForeignId('academic_year_id');
            $table->dropColumn(['student_id','student_sequence','middle_name','suffix','gender']);
        });
    }
}
